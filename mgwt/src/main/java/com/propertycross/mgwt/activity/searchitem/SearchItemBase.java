package com.propertycross.mgwt.activity.searchitem;

import com.propertycross.mgwt.nestoria.RequestSender.Callback;

public abstract class SearchItemBase {

	public SearchItemBase(String displayText) {
	  super();
	  this.displayText = displayText;
  }

	public String getDisplayText() {
  	return displayText;
  }

	private final String displayText;
	
	public abstract void doQuery(final Callback c);
}
