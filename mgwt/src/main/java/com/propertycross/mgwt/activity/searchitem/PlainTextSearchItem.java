package com.propertycross.mgwt.activity.searchitem;

import com.propertycross.mgwt.nestoria.QueryBuilder;
import com.propertycross.mgwt.nestoria.RequestSender;
import com.propertycross.mgwt.nestoria.RequestSender.Callback;
import com.propertycross.mgwt.nestoria.gwt.GwtRequestSender;

public class PlainTextSearchItem extends SearchItemBase {

	private final RequestSender requestSender = new GwtRequestSender();
	
	private final String searchText;
	
	public PlainTextSearchItem(String text) {
		super(text);
	  this.searchText = text;
	}
	
	public PlainTextSearchItem(String displayText, String searchText) {
	  super(displayText);
	  this.searchText = searchText;
  }

	@Override
  public void doQuery(Callback c) {
		QueryBuilder q = new QueryBuilder(requestSender);
    q.setPlaceName(searchText);
    q.doQuery(c);
  }

}
