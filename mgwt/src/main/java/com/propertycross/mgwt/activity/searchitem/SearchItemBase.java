package com.propertycross.mgwt.activity.searchitem;

import com.propertycross.mgwt.locations.Search;
import com.propertycross.mgwt.nestoria.RequestSender;
import com.propertycross.mgwt.nestoria.RequestSender.Callback;
import com.propertycross.mgwt.nestoria.gwt.GwtRequestSender;

public abstract class SearchItemBase {
	
	protected final RequestSender requestSender = new GwtRequestSender();
	
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
	
	private final String displayText;
	
	public abstract void doQuery(final Callback c);
	
	public abstract Search createPersistentSearch(int resultsCount);
}
