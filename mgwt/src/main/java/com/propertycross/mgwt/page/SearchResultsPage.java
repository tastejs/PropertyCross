package com.propertycross.mgwt.page;

import com.propertycross.mgwt.activity.SearchResultsActivity;
import com.propertycross.mgwt.view.SearchResultsView;

public class SearchResultsPage extends PageBase {

  private final SearchResultsView view;

  public SearchResultsPage() {
  	super(true, "results");
    view = new SearchResultsView(this);
    addBodyContent(view, false);
  }
  
  public SearchResultsActivity.View getView() {
  	return view;
  }
}
