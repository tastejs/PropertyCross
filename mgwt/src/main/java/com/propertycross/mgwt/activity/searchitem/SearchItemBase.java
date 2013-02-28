package com.propertycross.mgwt.activity.searchitem;

import com.propertycross.mgwt.nestoria.RequestSender.Callback;

public abstract class SearchItemBase {
	
	private int pageNumber;

	public SearchItemBase(String displayText) {
	  super();
	  this.displayText = displayText;
	  this.pageNumber = 1;
  }

	public int getPageNumber() {
  	return pageNumber;
  }

	public void setPageNumber(int pageNumber) {
  	this.pageNumber = pageNumber;
  }

	public String getDisplayText() {
  	return displayText;
  }
	
	public abstract String getSearchText();

	private final String displayText;
	
	public abstract void doQuery(final Callback c);
}
