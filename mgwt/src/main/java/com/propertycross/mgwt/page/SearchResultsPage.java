package com.propertycross.mgwt.page;

import com.propertycross.mgwt.activity.SearchResultsActivity;
import com.propertycross.mgwt.view.SearchResultsView;

public class SearchResultsPage extends PageBase {

  private final SearchResultsView view;

  public SearchResultsPage() {
  	super(true, false, "results");
    view = new SearchResultsView(this);
    addContent(view);
  }
  
  public SearchResultsActivity.View getView() {
  	return view;
  }
}
