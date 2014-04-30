package com.propertycross.neomad.model;

import com.neomades.json.JSONException;
import com.neomades.json.JSONObject;

/**
 * @author Neomades
 */
public class Location {

	private String title;
	private String name;

	public static Location valueOf(JSONObject json) {
		Location l = new Location();
		try {
			l.title = json.getString("long_title");
			l.name = json.getString("place_name");
		} catch (JSONException e) {
			l.title = "";
			l.name = "";
		}
		return l;
	}

	public String getTitle() {
		return title;
	}

	public String getName() {
		return name;
	}
}