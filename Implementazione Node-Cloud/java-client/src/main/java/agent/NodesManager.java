package agent;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.apache.cxf.jaxrs.client.WebClient;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;


/**
 * A NodeManager manage a single Node, its sensors and sensors samples
 * @author Cristian
 *
 */
public class NodesManager {
	
	/**
	 * Create a NodesManager
	 */
	private NodesManager() {
		
		client = WebClient.create("http://localhost:1880");
		
		nodes = new HashMap<String, Node>();
		broker = "tcp://localhost:1883";
		
		subscribeNodeUpdateTopic();
		subscribeSensorUpdateTopic();
		subscribeSensorAvailabilityTopic();
		doGetNodes();
		doGetSensors();
	}
	
	
	private void subscribeNodeUpdateTopic() {
		MqttClient client;
		try {
			client = new MqttClient(broker,"nodeUpdate");
			client.setCallback(new MqttCallback() {
					
				@Override
				public void messageArrived(String topic, MqttMessage message) throws Exception {
					System.out.println("Message received on topic: "+topic);
					Node newNode = Node.fromJSON(message.toString());
					if(newNode != null) {
						Node oldNode = nodes.get(newNode.getNodeId());
						if(oldNode != null) {
							oldNode.interrupt();
							System.out.println("Update node: "+newNode.getNodeId());
							newNode.setNewSensors(oldNode.getSensors());
							removeNode(oldNode);
							putNode(newNode);
							newNode.start();
						} else {
							System.out.println("New node: " + newNode);
						}
					}
				}
					
					@Override
					public void deliveryComplete(IMqttDeliveryToken token) {}
					
					@Override
					public void connectionLost(Throwable cause) {}
			});
			
			MqttConnectOptions mqOptions = new MqttConnectOptions();
			mqOptions.setCleanSession(true);
			client.connect(mqOptions);
			client.subscribe("nodes/update");
					 
		} catch (MqttException e) {
			e.printStackTrace();
		}		
	}
	
	private void subscribeSensorUpdateTopic() {
		MqttClient client;
		try {
			client = new MqttClient(broker,"sensorUpdate");
			client.setCallback(new MqttCallback() {
					
				@Override
				public void messageArrived(String topic, MqttMessage message) throws Exception {
					System.out.println("Message received on topic: "+topic);
					Sensor newSensor = Sensor.fromJSON(message.toString());
					if(newSensor != null) {
						Sensor oldSensor = findSensorByCode(newSensor.getCode());
						
						System.out.println("Update sensor: "+newSensor.getCode());
						Node node = nodes.get(newSensor.getNodeId());
						newSensor.setSamples(oldSensor.getSamples());
						oldSensor.interrupt();
						node.removeSensor(oldSensor);
						node.addSensor(newSensor);
						if(node.isAvailable())
							newSensor.start();
						else
							System.out.println("Node is not available. Sensor will not be started");
					}
				}
					
					@Override
					public void deliveryComplete(IMqttDeliveryToken token) {}
					
					@Override
					public void connectionLost(Throwable cause) {}
			});
			
			MqttConnectOptions mqOptions = new MqttConnectOptions();
			mqOptions.setCleanSession(true);
			client.connect(mqOptions);
			client.subscribe("nodes/sensors/update");
					 
		} catch (MqttException e) {
			e.printStackTrace();
		}		
	}
	
	private void subscribeSensorAvailabilityTopic() {
		MqttClient client;
		try {
			client = new MqttClient(broker,"sensorAvailabilityUpdate");
			client.setCallback(new MqttCallback() {
					
				@Override
				public void messageArrived(String topic, MqttMessage message) throws Exception {
					System.out.println("Message received on topic: "+topic);
					Sensor newSensor = Sensor.fromJSON(message.toString());
					if(newSensor != null) {
						boolean op = newSensor.isAvailable();
						Sensor oldSensor = findSensorByCode(newSensor.getCode());
						
						if(op) {
							System.out.println("Activation sensor: "+newSensor.getCode());
							Node node = nodes.get(newSensor.getNodeId());
							newSensor.setSamples(oldSensor.getSamples()); 
							oldSensor.interrupt();
							node.removeSensor(oldSensor);
							node.addSensor(newSensor);
							if(node.isAvailable())
								newSensor.start();
							else
								System.out.println("Node is not available. Sensor will not be started");
		
						} else {
							System.out.println("Deactivation sensor: "+newSensor.getCode());
							oldSensor.setAvailable(false);
							oldSensor.interrupt();
								
						}
					}
				}
					
					@Override
					public void deliveryComplete(IMqttDeliveryToken token) {}
					
					@Override
					public void connectionLost(Throwable cause) {}
			});
			
			MqttConnectOptions mqOptions = new MqttConnectOptions();
			mqOptions.setCleanSession(true);
			client.connect(mqOptions);
			client.subscribe("nodes/sensors/availability");
					 
		} catch (MqttException e) {
			e.printStackTrace();
		}
				
	}

	private void doGetNodes() {
		client.reset();
		client.accept("application/json").type("application/json");
		client.path("/node-cloud/nodes/");
		String string = client.get(String.class);
		fromJsonNodes(string);
	}
	
	private void doGetSensors() {
		client.reset();
		client.accept("application/json").type("application/json");
		client.path("/node-cloud/sensors/");
		String string = client.get(String.class);
		fromJsonSensors(string);
	}
	
	private void fromJsonNodes(String jsonString) {
		JsonParser parser = new JsonParser();
		JsonArray jsonArray = null;
		if(parser.parse(jsonString).isJsonArray()) {
			jsonArray = parser.parse(jsonString).getAsJsonArray();
			if(jsonArray != null && jsonArray.size() > 0) {
				JsonObject jsonObject = null;
				Node node = null;
				for(int i = 0; i < jsonArray.size(); i++) {
					jsonObject = jsonArray.get(i).getAsJsonObject();
					node = Node.fromJSON(jsonObject.toString());
					putNode(node);
				}
			}
		}
	}
	
	private void fromJsonSensors(String jsonString) {
		JsonParser parser = new JsonParser();
		JsonArray jsonArray = null;
		if(parser.parse(jsonString).isJsonArray()) {
			jsonArray = parser.parse(jsonString).getAsJsonArray();
			if(jsonArray != null && jsonArray.size() > 0) {
				JsonObject jsonObject = null;
				Sensor sensor = null;
				for(int i = 0; i < jsonArray.size(); i++) {
					jsonObject = jsonArray.get(i).getAsJsonObject();
					sensor = Sensor.fromJSON(jsonObject.toString());
					putSensor(sensor);
				}
			}
		}
	}

	public static NodesManager getInstance() {
		if(instance == null) {
			instance = new NodesManager();
		}
		return instance;
	}
	
	public Map<String, Node> getNodes() {
		return nodes;
	}

	public void setNodes(Map<String, Node> nodes) {
		this.nodes = nodes;
	}

	public WebClient getClient() {
		return client;
	}

	/**
	 * Start Node execution thread
	 */
	public void start() {
		Iterator<String> iterator = nodes.keySet().iterator();
		Node node = null;
		while(iterator.hasNext()) {
			node = nodes.get(iterator.next());
			node.start();
		}
	}
	
	public void putNode(Node node) {
		if(node != null && ! nodes.containsKey(node.getNodeId()))
			nodes.put(node.getNodeId(), node);
	}
	
	public void removeNode(Node node) {
		if(node != null && nodes.containsKey(node.getNodeId()))
			nodes.remove(node.getNodeId());
	}
	
	private void putSensor(Sensor sensor) {
		if(sensor != null) {
			Node node = nodes.get(sensor.getNodeId());
			if(node != null) {
				node.addSensor(sensor);
			}
		}
	}
	
	public void publishSample(Sample sample) {
		if(sample != null) {
			String topic = "nodes/sensors/samples";
			String content = sample.toJson();
			int qos = 2;
			
			
			try {
			    MqttClient sampleClient = new MqttClient(broker, sample.getCode());
			    MqttConnectOptions connOpts = new MqttConnectOptions();
			    connOpts.setCleanSession(true);
			    sampleClient.connect(connOpts);
			    System.out.println("Publishing message: "+content);
			    MqttMessage message = new MqttMessage(content.getBytes());
			    message.setQos(qos);
			    sampleClient.publish(topic, message);
			    sampleClient.disconnect();
			} catch(MqttException me) {
			    System.out.println("reason "+me.getReasonCode());
			    System.out.println("msg "+me.getMessage());
			    System.out.println("loc "+me.getLocalizedMessage());
			    System.out.println("cause "+me.getCause());
			    System.out.println("excep "+me);
			    	me.printStackTrace();
			    }
			}
		}

	private Sensor findSensorByCode(String sensorCode) {
		Set<String> keySet = nodes.keySet();
		Sensor sensor = null;
		for(String key : keySet) {
			if((sensor = nodes.get(key).findSensorByCode(sensorCode)) != null)
				return sensor;
		}
		return null;
	}

	public static void main(String[] args) {
		
		NodesManager nodesManager = NodesManager.getInstance();
		nodesManager.start();
			
	}
	
	private Map<String,Node> nodes;
	private WebClient client;
	private static NodesManager instance = null;
	private String broker;
	
}
