package com.propertycross.neomad.services;

import com.neomades.content.parser.Parser;
import com.neomades.json.JSONArray;
import com.neomades.json.JSONException;
import com.neomades.json.JSONObject;
import com.propertycross.neomad.Constants;
import com.propertycross.neomad.model.Location;
import com.propertycross.neomad.model.LocationList;
import com.propertycross.neomad.model.PropertyList;
import com.propertycross.neomad.model.SearchResult;

public class PropertyListParser implements Parser {

	public Object deserialize(byte[] data) {
		String json = new String(data);
		try {
			JSONObject response = new JSONObject(json).getJSONObject("response");
			
			// Get locations
			LocationList list = parseLocationList(response.getJSONArray("locations"));
			
			// Get PropertyList
			String code = response.getString("application_response_code");
			if (isUnambiguous(code) || isBestGuess(code) || isLarge(code)) {
				return new SearchResult(parsePropertyList(response), list, Constants.FOUND_SUCCESS);
			} else if (isAmbiguous(code) || isMisspelled(code)) {
				return new SearchResult(null, list, Constants.FOUND_AMBIGUOUS);
			}
		} catch (JSONException e) {
			// do nothing
		}
		return new SearchResult(null, null, Constants.FOUND_ERROR);
	}
	
	private PropertyList parsePropertyList(JSONObject response) {
		PropertyList l = new PropertyList();
		
			try {
				l.setCount(response.getInt("total_results"));
				l.setPage(response.getInt("page"));
				l.setPages(response.getInt("total_pages"));
				
				JSONArray propertyList = response.getJSONArray("listings");
				for (int i = 0; i < propertyList.length(); i++) {
					l.add(PropertyParser.valueOf(propertyList.getJSONObject(i)));
				}
			} catch (JSONException e) {
				l.setCount(0);
				l.setPage(0);
				l.setPages(0);
			}
		return l;
	}

	
	private LocationList parseLocationList(JSONArray locationsAsJSONArray) throws JSONException {
		LocationList l = new LocationList();
		for (int i = 0; i < locationsAsJSONArray.length(); i++) {
			l.addLocation(parseLocation(locationsAsJSONArray.getJSONObject(i)));
		}
		return l;
	}
	
	private Location parseLocation(JSONObject locationAsJSONObject) {
		Location l = new Location();
		try {
			l.setTitle(locationAsJSONObject.getString("long_title"));
			l.setName(locationAsJSONObject.getString("place_name"));
		} catch (JSONException e) {
			l.setTitle("");
			l.setName("");
		}
		return l;
	}
	
	public byte[] serialize(Object arg0) {
		// Not used
		return null;
	}

	private boolean isUnambiguous(String responseCode) {
		return responseCode.equals("100");
	}

	private boolean isBestGuess(String responseCode) {
		return responseCode.equals("101");
	}

	private boolean isLarge(String responseCode) {
		return responseCode.equals("110");
	}

	private boolean isAmbiguous(String responseCode) {
		return responseCode.equals("200");
	}

	private boolean isMisspelled(String responseCode) {
		return responseCode.equals("202");
	}
	
}
