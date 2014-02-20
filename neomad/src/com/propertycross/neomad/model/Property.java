package com.propertycross.neomad.model;

import com.neomades.json.JSONException;
import com.neomades.json.JSONObject;
import com.propertycross.neomad.utils.StringUtils;

/**
 * @author Neomades
 */
public class Property {
	private static final int THREE_DIGITS = 3;
	private static final int THOUSAND = 1000;
	private String guid;
	private String summary;
	private int price;
	private int bedrooms;
	private int bathrooms;
	private String propertyType;
	private String title;
	private String thumbnailUrl;
	private String imageUrl;

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
		return bedrooms + " bed, " + bathrooms + " bathroom";
	}

	public String getFormattedPrice() {
		if (price < THOUSAND) {
			return "£" + price;
		}

		String priceAsString = price + "";
		String formattedPrice = "";
		int index = priceAsString.length();

		while (index > 0) {
			if (index > THREE_DIGITS) {
				formattedPrice = ","
						+ priceAsString.substring(index - THREE_DIGITS, index)
						+ formattedPrice;
				index = index - THREE_DIGITS;
			} else {
				formattedPrice = "£" + priceAsString.substring(0, index)
						+ formattedPrice;
				index = 0;
			}
		}

		return formattedPrice;
	}

	public String getShortTitle() {
		String[] titleParts = StringUtils.split(title, ", ");
		if (titleParts.length >= 2) {
			return titleParts[0] + ", " + titleParts[1];
		}
		return title;
	}

	public static Property valueOf(JSONObject json) {
		Property p = new Property();
		try {
			p.guid = json.getString("guid");
			p.price = json.getInt("price");
			p.propertyType = json.getString("property_type");
			try {
				p.bedrooms = json.getInt("bedroom_number");
			} catch (JSONException ex) {
				p.bedrooms = 0;
			}
			try {
				p.bathrooms = json.getInt("bathroom_number");
			} catch (JSONException ex) {
				p.bathrooms = 0;
			}
			p.title = json.getString("title");
			p.thumbnailUrl = json.getString("thumb_url");
			p.imageUrl = json.getString("img_url");
			p.summary = json.getString("summary");

		} catch (JSONException ex) {
			p.guid = "";
			p.price = 0;
			p.propertyType = "";
			p.bedrooms = 0;
			p.bathrooms = 0;
			p.title = "";
			p.thumbnailUrl = "";
			p.imageUrl = "";
			p.summary = "";
		}
		return p;
	}
}
