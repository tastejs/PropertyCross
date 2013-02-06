package com.propertycross.mgwt.view.listitem;

public class LoadMoreIndicator extends ListItem {
	private final int totalProperties;
	
	private final int displayedProperties;
	
	private final String searchString;

	public LoadMoreIndicator(int displayedProperties, int totalProperties, String searchString) {
    this.totalProperties = totalProperties;
    this.searchString = searchString;
    this.displayedProperties = displayedProperties;
  }
	
	public int getDisplayedProperties() {
  	return displayedProperties;
  }

	public int getTotalProperties() {
  	return totalProperties;
  }

	public String getSearchString() {
  	return searchString;
  }
}
