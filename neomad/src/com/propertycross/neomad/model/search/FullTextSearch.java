package com.propertycross.neomad.model.search;

/**
 * @author Neomades
 */
public class FullTextSearch extends Search {

	private String label;
	private String query;

	public FullTextSearch(String label) {
		this(label, label);
	}

	public FullTextSearch(String label, String query) {
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

	public void setQuery(String query) {
		this.query = query;
	}
}
