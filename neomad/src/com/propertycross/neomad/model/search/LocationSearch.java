package com.propertycross.neomad.model.search;

import com.propertycross.neomad.model.Location;

/**
 * @author Neomades
 */
public class LocationSearch extends Search {

	private String label;
	private String query;
	private int page;
	
	private double latitude;
	private double longitude;

	public LocationSearch(Location l, int page) {
		this.label = l.getTitle();
		this.query = l.getName();
		this.page = page;
	}
	
	public LocationSearch(String l, int page) {
		this.label = l;
		this.query = l;
		this.page = page;
	}
	
	public LocationSearch(double latitude, double longitude, int page) {
		this.latitude = latitude;
		this.longitude = longitude;
		this.page = page;
	}

	public LocationSearch(String label, String query, int page) {
		this.label = label;
		this.query = query;
		this.page = page;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getQuery() {
		return query;
	}

	public void setPage(int page) {
		this.page = page;
	}
	
	public int getPage() {
		return page;
	}
	
	public double getLongitude() {
		return this.longitude;
	}
	
	public double getLatitude() {
		return this.latitude;
	}

	public void setQuery(String query) {
		this.query = query;
	}
}
