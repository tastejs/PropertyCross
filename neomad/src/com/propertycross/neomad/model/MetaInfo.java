package com.propertycross.neomad.model;

import com.propertycross.neomad.model.search.Search;

/**
 * @author Neomades
 */
public class MetaInfo {

	private Search query;
	private int count;
	private int total;

	public MetaInfo(Search query, int count, int total) {
		this.query = query;
		this.count = count;
		this.total = total;
	}

	public String toString() {
		return "Results for " + query.getLabel() + ", showing " + count
				+ " of " + total + " properties.";
	}
}
