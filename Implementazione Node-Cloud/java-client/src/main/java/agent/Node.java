package agent;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import util.Constants;

/**
 * A Node manage a collection of sensors
 * @author Cristian
 *
 */

public class Node implements Runnable{
	
	/**
	 * Create a Node
	 */
	public Node() {
		myThread = new Thread(this);
		this.sensors = new ArrayList<Sensor>();
		this.properties = new HashMap();
	}
	
	/**
	 * Create a node
	 * @param nodeId
	 * @param position
	 * @param name
	 * @param available
	 * @param latitude
	 * @param longitude
	 */
	public Node(String nodeId, String position, String name, boolean available,
			String latitude, String longitude) {
		
		this.nodeId = nodeId;
		this.position = position;
		this.name = name;
		this.available = available;
		this.latitude = latitude;
		this.longitude = longitude;
		this.sensors = new ArrayList<Sensor>();
		myThread = new Thread(this);
		this.properties = new HashMap<String, Object>();
	}
	
	/**
	 * Get Node ID
	 * @return
	 */
	public String getNodeId() {
		return nodeId;
	}
	
	/**
	 * Set Node ID
	 * @param nodeID
	 */
	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}
	
	/**
	 * Get Position of Node
	 * @return
	 */
	public String getPosition() {
		return position;
	}
	
	/**
	 * Set position of Node
	 * @param position
	 */
	public void setPosition(String position) {
		this.position = position;
	}
	
	/**
	 * Get Name
	 * @return
	 */
	public String getName() {
		return name;
	}
	
	/**
	 * Set Name
	 * @param name
	 */
	public void setName(String name) {
		this.name = name;
	}
	
	/**
	 * Verify if Node is Available
	 * @return
	 */
	public boolean isAvailable() {
		return available;
	}

	/**
	 * Set if Node is Available
	 * @param available
	 */
	public void setAvailable(boolean available) {
		this.available = available;
	}
	
	/**
	 * Get Latitude
	 * @return
	 */
	public String getLatitude() {
		return latitude;
	}
	
	/**
	 * Set Latitude
	 * @param latitude
	 */
	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}
	
	/**
	 * Get Longitude
	 * @return
	 */
	public String getLongitude() {
		return longitude;
	}
	
	/**
	 * Set Longitude
	 * @param latitude
	 */
	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}
	
	/**
	 * Get Sensors
	 * @return
	 */
	public List<Sensor> getSensors() {
		return sensors;
	}
	
	/**
	 * Set Sensors
	 * @param sensors
	 */
	public void setSensors(List<Sensor> sensors) {
		this.sensors = sensors;
	}
	
	/**
	 * Set New Sensors
	 * @param sensors
	 */
	public void setNewSensors(List<Sensor> sensors) {
		
		if(sensors != null) {
			this.sensors = new ArrayList<Sensor>();
			Sensor newSensor = null;
			for(Sensor sensor : sensors) {
				newSensor = Sensor.fromJSON(sensor.toJson());
				addSensor(newSensor);
			}
		}
		
	}
	
	public Map<String, Object> getProperties() {
		return properties;
	}

	public void setProperties(Map<String, Object> properties) {
		this.properties = properties;
	}

	public Thread getMyThread() {
		return myThread;
	}

	/**
	 * Get Sensor by Code
	 * @param code
	 * @return
	 */
	public Sensor getSensor(int i) {
		return sensors.get(i);
	}
	
	/**
	 * Add Sensor to collection
	 * @param sensor
	 */
	public void addSensor(Sensor sensor) {
		if(sensor != null && !sensors.contains(sensor)) {
			sensors.add(sensor);
		}
	}
	
	/**
	 * Remove Sensor
	 * @param sensor
	 */
	public void removeSensor(Sensor sensor) {
		sensors.remove(sensor);
	}
	
	/**
	 * Remove Sensor
	 * @param pos
	 */
	public void removeSensor(int pos) {
		sensors.remove(pos);
	}

	/**
	 * Add property to node
	 * @param sensor
	 */
	public void putProperty(String key, Object obj) {
		if(obj != null && properties != null && !properties.containsKey(key)) {
			properties.put(key, obj);
		}
	}
	
	/**
	 * Remove Property from node
	 * @param code
	 */
	public void removeProperty(String key) {
		properties.remove(key);
	}

	@Override
	public String toString() {
		return "Node [nodeID=" + nodeId + ", position=" + position + ", name=" + name + ", latitude=" + latitude
				+ ", longitude=" + longitude + ", available=" + available + ", sensors=" + sensors + ", properties="
				+ properties + "]";
	}

	/**
	 * Add Sample to the specify sensor
	 * @param code
	 * @param sample
	 */
	public void addSample(String code, Sample sample) {
		if(sample != null) {
			Sensor sensor = null;
			if((sensor = findSensorByCode(code)) != null) {
				sensor.addSample(sample);
			}
		}
	}
	
	public Sensor findSensorByCode(String code) {
		boolean found = false;
		int i = 0;
		Sensor sensor = null;
		if(sensors != null) {
			while(i < sensors.size() && !found) {
				if(sensors.get(i).getCode().equalsIgnoreCase(code)) {
					sensor = sensors.get(i);
					found = true;
				}
				else i++;
			}
		}
		return sensor;
		
	}
	
	public static Node fromJSON(String jsonString) {
		Node node = new Node();
		JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();
		
		node.setNodeId(jsonObject.get("nodeId").getAsString());
		node.setName(jsonObject.get("name").getAsString());
		node.setPosition(jsonObject.get("position").getAsString());
		node.setLatitude(jsonObject.get("latitude").getAsString());
		node.setLongitude(jsonObject.get("longitude").getAsString());
		node.setAvailable(jsonObject.get("isAvailable").getAsBoolean());
		
		Map<String, Object> attributes = new HashMap<String, Object>();
		Set<Map.Entry<String, JsonElement>> entrySet = jsonObject.entrySet();
		for(Map.Entry<String,JsonElement> entry : entrySet){
			if(!jsonObject.get(entry.getKey()).isJsonArray() && !isKeyProperty(entry.getKey()) 
					&& !jsonObject.get(entry.getKey()).isJsonObject())
				attributes.put(entry.getKey(), jsonObject.get(entry.getKey()).getAsString());
		}
		
		node.setProperties(attributes);
		
		JsonArray sensors = null;
		Sensor sensor = null;
		if(jsonObject.get("sensors") != null) {
			if(jsonObject.get("sensors").isJsonArray())
				sensors = jsonObject.get("sensors").getAsJsonArray();
			if(sensors != null && sensors.size() > 0) {
				for(int i = 0; i < sensors.size(); i++) {
					sensor = Sensor.fromJSON(sensors.get(i).toString());
					node.addSensor(sensor);
				}
			}
		}
		
		return node;
	}
	
	public String toJson() {
		Gson g = new Gson();
		String jsonString = g.toJson(this);
		JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();
		
		JsonObject nodeProperties = null;
		if(jsonObject.get("properties").isJsonObject())
			nodeProperties = jsonObject.get("properties").getAsJsonObject();
		if(nodeProperties != null) {
			Set<Map.Entry<String, JsonElement>> entrySet = nodeProperties.entrySet();
			for(Map.Entry<String,JsonElement> entry : entrySet){
				jsonObject.addProperty(entry.getKey(), nodeProperties.get(entry.getKey()).getAsString());
			}
		}
		
		JsonArray sensorsArray = null;
		if(jsonObject.get("sensors").isJsonArray())
			sensorsArray = jsonObject.get("sensors").getAsJsonArray();
		if(sensorsArray != null && sensorsArray.size() > 0) {
			JsonObject sensor = null;
			JsonObject sensorProperties = null;
			for(int i = 0; i < sensorsArray.size(); i++) {
				if(sensorsArray.get(i).isJsonObject())
					sensor = sensorsArray.get(i).getAsJsonObject();
				if(sensor != null) {
					if(sensor.get("properties").isJsonObject())
						sensorProperties = sensor.get("properties").getAsJsonObject();
					if(sensorProperties != null) {
						Set<Map.Entry<String, JsonElement>> entrySet = sensorProperties.entrySet();
						for(Map.Entry<String,JsonElement> entry : entrySet){
							sensor.addProperty(entry.getKey(), sensorProperties.get(entry.getKey()).getAsString());
						}
					}
				}
				sensor.remove("properties");
			}
		}

		
		jsonObject.remove("properties");
		return jsonObject.toString();
	}
	
	private static boolean isKeyProperty(String key) {
		
		return key.equalsIgnoreCase("_id") || key.equalsIgnoreCase("nodeId")
				|| key.equalsIgnoreCase("name") || key.equalsIgnoreCase("position")
				|| key.equalsIgnoreCase("isAvailable") || key.equalsIgnoreCase("latitude")
				|| key.equalsIgnoreCase("longitude") || key.equalsIgnoreCase("sensors");
	}

	/**
	 * Generate a Node ID
	 * @return
	 */
	public static String genereteNodeId() {
		return Constants.CODE_GENERATOR.format(new Date());
	}
	
	/**
	 * Start the execution of Thread
	 */
	public void start() {
		if(this.isAvailable())
			myThread.start();
	}
	
	
	public void run() {
		if(available) {
			for(Sensor sensor : sensors) {
				if(sensor.isAvailable())
					sensor.start();
			}
		}
	}
	
	public boolean isInterrupted() {
		return myThread.isInterrupted();
	}

	public void interrupt() {
		for(Sensor sensor : sensors) {
			sensor.interrupt();
		}
	}
	
	private String nodeId, position, name, latitude, longitude;
	private boolean available;
	private List<Sensor> sensors;
	private transient Thread myThread;
	private Map<String, Object> properties;
}
