package agent;

import java.util.Date;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import util.Constants;

/**
 * A Sample is a measurement  
 * @author Cristian
 *
 */
public class Sample {

	/**
	 * Create a Sample
	 */
	public Sample() {}
	
	/**
	 * Create a Sample
	 * @param sensorCode
	 * @param code
	 * @param value
	 * @param date
	 */
	public Sample(String sensorCode, String code, double value, Date date) {
		this.sensorCode = sensorCode;
		this.code = code;
		this.value = value;
		this.date = date;
	}
	
	/**
	 * Get sensor code
	 * @return
	 */ 
	public String getSensorCode() {
		return sensorCode;
	}

	/**
	 * Set sensor code
	 * @param sensorCode
	 */
	public void setSensorCode(String sensorCode) {
		this.sensorCode = sensorCode;
	}

	/**
	 * Get Sample code
	 * @return
	 */
	public String getCode() {
		return code;
	}

	/**
	 * Set Sample code
	 * @param code
	 */
	public void setCode(String code) {
		this.code = code;
	}

	/**
	 * Get value
	 * @return
	 */
	public double getValue() {
		return value;
	}
	
	/**
	 * Set value
	 * @param value
	 */
	public void setValue(double value) {
		this.value = value;
	}
	
	/**
	 * Get date
	 * @return
	 */
	public Date getDate() {
		return date;
	}
	
	/**
	 * Set Date
	 * @param date
	 */
	public void setDate(Date date) {
		this.date = date;
	}

	@Override
	public String toString() {
		return "Sample [sensorCode=" + sensorCode + ", code=" + code + ", value=" + value + ", date=" + date + "]";
	}
	
	/**
	 * Generate a sample code from a sensor context
	 * @param sensorCode
	 * @return
	 */
	public static String genereteSampleCode(String sensorCode) {
		return sensorCode.trim()+Constants.CODE_GENERATOR.format(new Date());
	}
	
	@Override
	public boolean equals(Object obj) {
		Sample sample = (Sample) obj;
		if(this.getCode().equals(sample.getCode()) && this.getDate().equals(sample.getDate())
				&& this.getSensorCode().equals(sample.getSensorCode()) 
				&& this.getValue() == sample.getValue()) {
			return true;
		}
		return false;
	}
	
	public static Sample fromJSON(String jsonString) {
		
		Sample sample = new Sample();
		JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();
		
		sample.setCode(jsonObject.get("code").getAsString());
		sample.setSensorCode(jsonObject.get("sensorCode").getAsString());
		sample.setValue(jsonObject.get("measure").getAsDouble());
		
		String dateString = jsonObject.get("date").getAsString();
		dateString = dateString.replace('T', ' ');
		try {
			sample.setDate(Constants.SD.parse(dateString));
		} catch (java.text.ParseException e) {
			sample.setDate(new Date());
			e.printStackTrace();
		}
		
		return sample;
	}
	
	public String toJson() {
		Gson g = new Gson();
		return g.toJson(this);
	}
	
	private static boolean isKeyProperty(String key) {
		
		return key.equalsIgnoreCase("code") || key.equalsIgnoreCase("nodeId")
				|| key.equalsIgnoreCase("sampleTime") || key.equalsIgnoreCase("precision")
				|| key.equalsIgnoreCase("isAvailable") || key.equalsIgnoreCase("context");
	}
	
	private String sensorCode, code;
	private double value;
	private Date date;
	
}
