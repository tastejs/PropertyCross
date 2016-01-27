package com.propertycross.neomad.services;

import com.neomades.json.JSONException;
import com.neomades.json.JSONObject;
import com.propertycross.neomad.model.Property;

public class PropertyParser {

	public static Property valueOf(JSONObject json) {
		Property p = new Property();
		try {
			p.setGuid(json.getString("guid"));
			p.setPrice(json.getInt("price"));
			p.setPropertyType(json.getString("property_type"));
			try {
				p.setBedrooms(json.getInt("bedroom_number"));
			} catch (JSONException ex) {
				p.setBedrooms(0);
			}
			try {
				p.setBathrooms(json.getInt("bathroom_number"));
			} catch (JSONException ex) {
				p.setBathrooms(0);
			}
			p.setTitle(json.getString("title"));
			p.setThumbnailUrl(json.getString("thumb_url"));
			p.setImageUrl(json.getString("img_url"));
			p.setSummary(json.getString("summary"));

		} catch (JSONException ex) {
			p.setGuid("");
			p.setPrice(0);
			p.setPropertyType("");
			p.setBedrooms(0);
			p.setBathrooms(0);
			p.setTitle("");
			p.setThumbnailUrl("");
			p.setImageUrl("");
			p.setSummary("");
		}
		return p;
	}
	
	public static JSONObject toJSONObject(Property property) throws JSONException {
		JSONObject propertyAsJSONObject = new JSONObject();
		propertyAsJSONObject.put("guid", property.getGuid());
		propertyAsJSONObject.put("price", property.getPrice());
		propertyAsJSONObject.put("property_type", property.getPropertyType());
		propertyAsJSONObject.put("bedroom_number", property.getBedrooms());
		propertyAsJSONObject.put("bathroom_number", property.getBathrooms());
		propertyAsJSONObject.put("title", property.getTitle());
		propertyAsJSONObject.put("thumb_url", property.getThumbnailUrl());
		propertyAsJSONObject.put("img_url", property.getImageUrl());
		propertyAsJSONObject.put("summary", property.getSummary());
		
		return propertyAsJSONObject;
	}

}
