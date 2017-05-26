package com.propertycross.android.model;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class PropertyLocationsResult extends PropertyDataSourceResult {

	private List<Location> data;

	public PropertyLocationsResult(JSONObject result) {
		data = new ArrayList<Location>();
		try {
			JSONObject response = result.getJSONObject("response");

			JSONArray location = response.getJSONArray("locations");
			for (int i = 0; i < location.length(); i++) {
				data.add(new Location(location.getJSONObject(i)));
			}
		}
		catch (JSONException e) {
			data.clear();
		}
	}

	public List<Location> getData() {
		return data;
	}
}