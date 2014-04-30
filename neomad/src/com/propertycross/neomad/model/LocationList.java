package com.propertycross.neomad.model;

import java.util.Vector;

import com.neomades.json.JSONArray;
import com.neomades.json.JSONException;
import com.neomades.json.JSONObject;
import com.propertycross.neomad.utils.Log;

/**
 * @author Neomades
 */
public class LocationList {

	private static final String JSON_LOCATIONS = "locations";
	private static final String JSON_RESPONSE = "response";
	private Vector data;

	/**
	 * @param json
	 * @return
	 */
	public static LocationList valueOf(JSONObject json) {
		LocationList l = new LocationList();
		l.data = new Vector();
		try {
			JSONObject res = json.getJSONObject(JSON_RESPONSE);
			JSONArray list = res.getJSONArray(JSON_LOCATIONS);
			for (int i = 0; i < list.length(); i++) {
				l.data.addElement(Location.valueOf(list.getJSONObject(i)));
			}
		} catch (JSONException ex) {
			Log.d(ex.getMessage());
		}
		return l;
	}

	public Vector getData() {
		return data;
	}
}
