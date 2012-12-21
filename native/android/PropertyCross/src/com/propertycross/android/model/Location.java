package com.propertycross.android.model;

import org.json.JSONException;
import org.json.JSONObject;

public class Location {

	private String displayName;
	private String name;
	
	public Location(JSONObject jsonLocation) {
		try {
	      displayName = jsonLocation.getString("long_title");
	      name = jsonLocation.getString("place_name");
	    }
		catch (JSONException e) {
	      displayName = "";
	      name = "";
	    }
	}
	
	public Location(String location) {
		displayName = location;
		name = location;
	}
	
	public String getDisplayName() {
		return displayName;
	}
	
	public String getName() {
		return name;
	}
}
