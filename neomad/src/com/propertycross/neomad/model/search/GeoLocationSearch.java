package com.propertycross.neomad.model.search;

import com.propertycross.neomad.model.Location;

/**
 * @author Neomades
 */
public class GeoLocationSearch extends Search {

	private String label;
	private String query;

	public GeoLocationSearch(Location l) {
		this.label = l.getTitle();
		this.query = l.getName();
	}

	public GeoLocationSearch(String label, String query) {
		this.label = label;
		this.query = query;
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
}
