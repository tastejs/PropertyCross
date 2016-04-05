package com.propertycross.neomad.model.search;

/**
 * @author Neomades
 */
public abstract class Search {

	public abstract String getLabel();

	public abstract String getQuery();
	
	public abstract int getPage();
	
	public abstract void setPage(int page);

	public abstract void setLabel(String label);
	
	public abstract void setQuery(String query);
}
