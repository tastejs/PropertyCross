package com.propertycross.mgwt.activity.searchitem;

import com.propertycross.mgwt.locations.Search;
import com.propertycross.mgwt.nestoria.QueryBuilder;
import com.propertycross.mgwt.nestoria.RequestSender.Callback;

public class PlainTextSearchItem extends SearchItemBase {

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
    q.setPage(getPageNumber());
    q.doQuery(c);
  }


	@Override
  public Search createPersistentSearch(int resultsCount) {
		return new Search(this.getDisplayText(), this.searchText,
					    resultsCount);
  }

}
