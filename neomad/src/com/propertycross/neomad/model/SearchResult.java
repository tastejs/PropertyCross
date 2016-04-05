package com.propertycross.neomad.model;

import com.propertycross.neomad.Constants;


public class SearchResult {

	private PropertyList propertyList;
	private LocationList locationList;
	private int status;
	
	public SearchResult(PropertyList propertyList, LocationList locationList, int status) {
		this.propertyList = propertyList;
		this.locationList = locationList;
		this.status = status;
	}

	public PropertyList getPropertyList() {
		return propertyList;
	}

	public LocationList getLocationList() {
		return locationList;
	}
	
	public boolean isAmbiguous() {
		return status == Constants.FOUND_AMBIGUOUS;
	}
	
	public boolean isError() {
		return status == Constants.FOUND_ERROR;
	}

	public boolean isSuccess() {
		return status == Constants.FOUND_SUCCESS;
	}
}
