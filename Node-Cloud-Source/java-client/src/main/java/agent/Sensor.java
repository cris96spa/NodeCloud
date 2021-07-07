package agent;

import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.StringTokenizer;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import util.Constants;
import util.InvalidContextException;
import util.InvalidSampleTimeException;
import util.InvalidWindowException;

/**
 * A Sensor perform a measure of a given a context
 * @author Daniele Carta
 * @author Cristian C. Spagnuolo
 *
 */
public class Sensor implements Runnable{
	
	/**
	 * Create Sensor
	 */
	public Sensor() {
		samples = new LinkedList<Sample>();
		myThread = new Thread(this);
		properties = new HashMap<String, Object>();
		interrupted = false;
		baseValue = -100213;
	}
	
	/**
	 * Create Sensor
	 * @param nodeId
	 * @param code
	 * @param sampleTime
	 * @param precision
	 * @param available
	 */
	public Sensor(String nodeId, String code, long sampleTime, String precision, boolean available) {
		this.nodeId = nodeId;
		this.code = code;
		this.sampleTime = sampleTime;
		this.precision = precision;
		this.available = available;
		this.context = evaluateContext(code);
		samples = new LinkedList<Sample>();
		myThread = new Thread(this);
		properties = new HashMap<String, Object>();
		interrupted = false;
		setBaseSamplesValue();
	}
	
	/**
	 * Allow to set the mean value of the Sample distribution.
	 */
	private void setBaseSamplesValue() {
		Random rand = new Random();
		
		if(evaluateContext(this.code).equals(CONTEXT_TEMPERATURE)) {
			baseValue = rand.nextInt(30);
			if(rand.nextBoolean())
				baseValue += rand.nextDouble()*10;
			else
				baseValue -= rand.nextDouble()*10;
		} else {
			baseValue = rand.nextDouble()*100;
		}
	}
	
	/**
	 * Reset the mean value of the Sample distribution.
	 */
	private void resetBaseSamplesValue() {
		Random rand = new Random();
		if(rand.nextInt(100) == rand.nextInt(100)) {
			setBaseSamplesValue();
		}
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
	 * @param nodeId
	 */
	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}

	/**
	 * Get Sensor code
	 * @return sensor code
	 */
	public String getCode() {
		return code;
	}
	
	/**
	 * Set Sensor code
	 * @param code
	 */
	public void setCode(String code) {
		this.code = code;
	}
	
	/**
	 * Get Sample time
	 * @return
	 */
	public long getSampleTime() {
		return sampleTime;
	}
	
	/**
	 * Set Sample time
	 * @param sampleTime
	 */
	public void setSampleTime(long sampleTime) {
		this.sampleTime = sampleTime;
	}
	
	/**
	 * Get Precision
	 * @return
	 */
	public String getPrecision() {
		return precision;
	}
	
	/**
	 * Set Precision
	 * @param precision
	 */
	public void setPrecision(String precision) {
		this.precision = precision;
	}
	
	/**
	 * Get the execution Thread
	 * @return
	 */
	public Thread getMyThread() {
		return myThread;
	}

	/**
	 * Set execution thread
	 * @param myThread
	 */
	public void setMyThread(Thread myThread) {
		this.myThread = myThread;
	}
	
	/**
	 * Get Measurement Context
	 * @return
	 */
	public String getContext() {
		return context;
	}

	/**
	 * Set Measurement context
	 * @param context
	 */
	public void setContext(String context) {
		this.context = context;
		if(baseValue == -100213) {
			setBaseSamplesValue();
		}
	}

	/**
	 * Verify if Sensor is available
	 * @return
	 */
	public boolean isAvailable() {
		return available;
	}
	
	/**
	 * Set Sensor availability
	 * @param available
	 */
	public void setAvailable(boolean available) {
		this.available = available;
	}
	
	/**
	 * Get collection of Samples
	 * @return
	 */
	public List<Sample> getSamples() {
		return samples;
	}

	/**
	 * Set Collection of Samples
	 * @param samples
	 */
	public void setSamples(List<Sample> samples) {
		this.samples = samples;
		orderSamples();
	}
	
	public Map<String, Object> getProperties() {
		return properties;
	}

	public void setProperties(Map<String, Object> properties) {
		this.properties = properties;
	}

	/**
	 * Add property to sensor
	 * @param key
	 * @param obj
	 */
	public void putProperty(String key, Object obj) {
		if(obj != null && properties != null && !properties.containsKey(key)) {
			properties.put(key, obj);
		}
	}
	
	/**
	 * Remove Property from node
	 * @param key
	 */
	public void removeProperty(String key) {
		properties.remove(key);
	}
	
	/**
	 * Evaluate Context from Sensor code
	 * @param code
	 * @return
	 */
	public static String evaluateContext(String code) {
		
		if(code.startsWith(CODE_TEMPERATURE))
			return CONTEXT_TEMPERATURE;
		else if(code.startsWith(CODE_HUMIDITY))
			return CONTEXT_HUMIDITY;
		else 
			return CONTEXT_NONE;
	}

	@Override
	public String toString() {
		return "Sensor [nodeId=" + nodeId + ", code=" + code + ", sampleTime=" + sampleTime + ", precision=" + precision
				+ ", context=" + context + ", available=" + available + ", samples=" + samples + ", properties="
				+ properties + "]";
	}

	/**
	 * Get Samples average
	 * @return
	 */
	public float getSamplesAverage() {
		int len = samples.size();
		float sum = 0;
		for(Sample sample : samples) {
			sum += sample.getValue();
		}
		if(len != 0)
			return sum/len;
		else
			return 0;
	}
	
	/**
	 * Get samplesAverage from a specify set of Samples
	 * @param base
	 * @param limit
	 * @return
	 * @throws InvalidWindowException
	 */
	public float getSamplesAverage(int base, int limit) throws InvalidWindowException {
		if(base >= 0 && limit > base) {
			float sum = 0;
			int i = base;
			while(i < samples.size() && i < limit) {
				sum += samples.get(i).getValue();
				i++;
			}
			
			return (sum/(limit-base));
		} else 
			throw new InvalidWindowException("Window delimiters not valid. Limit must be grather than base, and both must be positive");
	}

	/**
	 * Add a Sample
	 * @param sample
	 */
	public void addSample(Sample sample) {
		if((sample != null) && (sample.getCode().equals(code))) {
			samples.add(sample);
			orderSamples();
		}
	}
	
	/**
	 * Create a sample from a measurement
	 * @return
	 */
	private Sample generateSample() {
		Date date= new Date();
		String sampleCode = Sample.genereteSampleCode(this.code);
		calculateBaseValue();
		return new Sample(this.code, sampleCode, baseValue, date);
	}
	
	/**
	 * Custom function to randomize the sampling process
	 */
	private void calculateBaseValue() {
		resetBaseSamplesValue();
		Random rand = new Random();
		int hourOfDay = (Calendar.getInstance()).get(Calendar.HOUR_OF_DAY);
		if(evaluateContext(this.code).equals(CONTEXT_TEMPERATURE)) {
			double amount = rand.nextDouble();
			double sign = 1;
			int prob = rand.nextInt(8);
			if(hourOfDay >= 5 && hourOfDay < 12) {
				if(prob == 3)
					sign = -1;
				baseValue += (amount *0.7 * sign);
			} else if(hourOfDay >= 12 && hourOfDay < 16) {
				if(prob == 3)
					sign = -1;
				baseValue += (amount*0.9*sign);
			} else if(hourOfDay >= 16 && hourOfDay < 20) {
				if(prob != 3)
					sign = -1;
				baseValue += (amount*0.7*sign);
			} else {
				if(prob != 3)
					sign = -1;
				baseValue += (amount*0.9*sign);
			}
			
		} else {
			if(baseValue > 10 && baseValue < 90 ){
				if(rand.nextBoolean())
					baseValue += rand.nextDouble()*10;
				else
					baseValue -= rand.nextDouble()*10;
			} else if(baseValue <= 10) {
				baseValue *= rand.nextDouble()*3;
			} else if(baseValue >= 90) {
				baseValue -= rand.nextDouble()*6;
			}
		}
	}

	/**
	 * Remove sample
	 * @param pos
	 */
	public void removeSample(int pos) {
		samples.remove(pos);
	}
	
	/**
	 * Remove sample
	 * @param sample
	 */
	public void removeSample(Sample sample) {
		samples.remove(sample);
	}
	
	/**
	 * Remove sample
	 * @param sampleCode
	 */
	public void removeSample(String sampleCode) {
		samples.remove(findSampleByCode(sampleCode));
	}
	
	/**
	 * Reset collection of samples
	 */
	public void clearSamples() {
		samples.clear();
	}
	
	/**
	 * Order samples by date
	 */
	private void orderSamples() {
		Collections.sort(samples, new Comparator<Sample>() {

			public int compare(Sample s1, Sample s2) {
				return (s1.getDate().compareTo(s2.getDate()))*(-1);
			}
		} );
	}
	
	/**
	 * Get last Sample
	 * @return
	 */
	public Sample getLastSample() {
		if(samples == null || samples.size()== 0)
			return null;
		else {
			Date max = samples.get(0).getDate();
			int maxPos = 0;
			for(int j = 1; j < samples.size(); j++) {
				if(samples.get(j).getDate().after(max)) {
					maxPos = j;
					max = samples.get(j).getDate();
				}	
			}
			return samples.get(maxPos);
		}
	}
	
	/**
	 * Start execution thread
	 */
	public void start() {
		if(!myThread.isAlive() && this.isAvailable())
			myThread.start();
	}
	
	/**
	 * Check whether or not the thread has been interrupted 
	 * @return
	 */
	public boolean isInterrupted() {
		return interrupted;
	}
	
	/**
	 * Stop the thread
	 */
	public void interrupt() {
		interrupted = true;
	}
	
	/**
	 * Body of the thread
	 */
	public void run() {
		while(!interrupted) {
			Sample sample = generateSample();
			if(sample != null) {
			
				addSample(sample);
				publishSample(sample);
			}
			try {
				myThread.sleep(sampleTime);	
			} catch (InterruptedException e) {

			} 
		}
	}
	
	/**
	 * Find sample by Sample code
	 * @param sampleCode
	 * @return
	 */
	public Sample findSampleByCode(String sampleCode) {
		int i = 0;
		boolean found = false;
		Sample sample = null;
		while(i<samples.size() && !found) {
			if(samples.get(i).getCode().equals(sampleCode)) {
				sample = samples.get(i);
				found = true;
			}
			else 
				i++;
		}
		return sample;
	}
	
	/**
	 * Generate Sample code by sensorCode
	 * @param context
	 * @return
	 * @throws InvalidContextException
	 */
	public static String generateSensorCode(String context) throws InvalidContextException {
		String sensorCode = "";
		switch(context) {
			case CONTEXT_TEMPERATURE:
				sensorCode = CODE_TEMPERATURE;
				break;
			case CONTEXT_HUMIDITY:
				sensorCode = CODE_HUMIDITY;
				break;
			default:
				throw new InvalidContextException("Context is invalid. You can choose it from Sensor.class constants");
		}
		return sensorCode + Constants.CODE_GENERATOR.format(new Date());
	}
	
	/**
	 * Build a Java object from JSON
	 * @param jsonString
	 * @return
	 */
	public static Sensor fromJSON(String jsonString) {
		Sensor sensor = new Sensor();
		JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();
		
		
		sensor.setCode(jsonObject.get("code").getAsString());
		sensor.setNodeId(jsonObject.get("nodeId").getAsString());
		sensor.setSampleTime(jsonObject.get("sampleTime").getAsLong());
		sensor.setContext(jsonObject.get("context").getAsString());
		sensor.setAvailable(jsonObject.get("isAvailable").getAsBoolean());
		sensor.setPrecision(jsonObject.get("precision").getAsString());
		
		Map<String, Object> attributes = new HashMap<String, Object>();
		Set<Map.Entry<String, JsonElement>> entrySet = jsonObject.entrySet();
		for(Map.Entry<String,JsonElement> entry : entrySet){
			if(!jsonObject.get(entry.getKey()).isJsonArray() && !isKeyProperty(entry.getKey()) 
					&& !jsonObject.get(entry.getKey()).isJsonObject())
				attributes.put(entry.getKey(), jsonObject.get(entry.getKey()).getAsString());
		}
		
		sensor.setProperties(attributes);
		return sensor;
	}
	
	/**
	 * Convert the Java Object to JSON
	 * @return
	 */
	public String toJson() {
		Gson g = new Gson();
		String jsonString = g.toJson(this);
		JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();
		
		JsonObject properties = null;
		if(jsonObject.get("properties").isJsonObject())
			properties = jsonObject.get("properties").getAsJsonObject();
		if(properties != null) {
			Set<Map.Entry<String, JsonElement>> entrySet = properties.entrySet();
			for(Map.Entry<String,JsonElement> entry : entrySet){
				jsonObject.addProperty(entry.getKey(), properties.get(entry.getKey()).getAsString());
			}
		}
		jsonObject.addProperty("isAvailable", available);
		jsonObject.remove("properties");
		jsonObject.remove("interrupted");
		jsonObject.remove("available");
		return jsonObject.toString();
	}
	
	/**
	 * Evaluate which are key properties of the sensor.
	 * @param key
	 * @return
	 */
	private static boolean isKeyProperty(String key) {
		return key.equalsIgnoreCase("code") || key.equalsIgnoreCase("nodeId")
				|| key.equalsIgnoreCase("sampleTime") || key.equalsIgnoreCase("precision")
				|| key.equalsIgnoreCase("isAvailable") || key.equalsIgnoreCase("context");
	}
	
	public void publishSample(Sample sample) {
		NodesManager.getInstance().publishSample(sample);
	}

	private String nodeId, code, precision;
	private long sampleTime;
	private String context;
	private boolean available;
	private List<Sample> samples;
	private transient Thread myThread; 
	private Map<String, Object> properties;
	public static final transient String CONTEXT_TEMPERATURE = "Temperature";
	public static final transient String CONTEXT_HUMIDITY= "Humidity";
	public static final transient String CONTEXT_NONE= "None";
	public static final transient String CODE_TEMPERATURE = "TMP";
	public static final transient String CODE_HUMIDITY= "HMD";
	private transient double baseValue;
	private boolean interrupted;
}
