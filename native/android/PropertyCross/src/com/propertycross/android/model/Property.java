package com.propertycross.android.model;

import java.util.Locale;

import org.json.JSONException;
import org.json.JSONObject;

public class Property {

	private String guid;
	private String summary;
	private int price;
	private int bedrooms;
	private int bathrooms;
	private String propertyType;
	private String title;
	private String thumbnailUrl;
	private String imageUrl;
	
	public Property(JSONObject jsonProperty) {
		try
	    {
	      guid = jsonProperty.getString("guid");
	      price = jsonProperty.getInt("price");
	      propertyType = jsonProperty.getString("property_type");
	      
	      /*
	       * The number of bedrooms / bathrooms may be 0. This is represented
	       * by an absence of the bedroom_number or bathroom_number entry
	       * in the JSON file.
	       */
	      try {
	    	  bedrooms = jsonProperty.getInt("bedroom_number");
	      }
	      catch (JSONException e) {
	    	  bedrooms = 0;
	      }
	      
	      try {
	    	  bathrooms = jsonProperty.getInt("bathroom_number");
	      }
	     catch (JSONException e) {
	    	 bathrooms = 0;
	     }
	      
	      title = jsonProperty.getString("title");
	      thumbnailUrl = jsonProperty.getString("thumb_url");
	      imageUrl = jsonProperty.getString("img_url");
	      summary = jsonProperty.getString("summary");
	    } 
	    catch (JSONException e) {
	      guid = "";
	      price = 0;
	      propertyType = "";
	      bedrooms = 0;
	      bathrooms = 0;
	      title = "";
	      thumbnailUrl = "";
	      imageUrl = "";
	      summary = "";
	    }
	  }
	
	public String getGuid() {
		return guid;
	}
	
	public String getSummary() {
		return summary;
	}
	
	public int getPrice() {
		return price;
	}
	
	public int getBedrooms() {
		return bedrooms;
	}
	
	public int getBathrooms() {
		return bathrooms;
	}
	
	public String getPropertyType() {
		return propertyType;
	}
	
	public String getTitle() {
		return title;
	}
	
	public String getThumbnailUrl() {
		return thumbnailUrl;
	}
	
	public String getImageUrl() {
		return imageUrl;
	}
	
	public String getBedBathroomText() {
		return String.format(Locale.ENGLISH, "%d bed, %d bathroom", bedrooms, bathrooms); 
	}
	
	public String getFormattedPrice() {
		return String.format(Locale.ENGLISH, "\u00A3%,d", price);
	}
	
	public String getShortTitle() {
		String[] titleParts = title.split(",");
		if (titleParts.length >= 2) {
			return titleParts[0] + ", " + titleParts[1];
		}
		return title;
	}	
}
