package com.propertycross.neomad.model;

import com.neomades.util.StringUtils;

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

	public void setGuid(String guid) {
		this.guid = guid;
	}

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	public int getBedrooms() {
		return bedrooms;
	}

	public void setBedrooms(int bedrooms) {
		this.bedrooms = bedrooms;
	}

	public int getBathrooms() {
		return bathrooms;
	}

	public void setBathrooms(int bathrooms) {
		this.bathrooms = bathrooms;
	}

	public String getPropertyType() {
		return propertyType;
	}

	public void setPropertyType(String propertyType) {
		this.propertyType = propertyType;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getThumbnailUrl() {
		return thumbnailUrl;
	}

	public void setThumbnailUrl(String thumbnailUrl) {
		this.thumbnailUrl = thumbnailUrl;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
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

	public String getBedBathroomText() {
		return bedrooms + " bed, " + bathrooms + " bathroom";
	}
}
