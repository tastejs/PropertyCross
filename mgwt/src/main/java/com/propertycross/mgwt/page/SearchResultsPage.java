package com.propertycross.mgwt.page;

import com.propertycross.mgwt.view.PropertyCrossView;
import com.propertycross.mgwt.view.SearchResultsView;
import com.propertycross.mgwt.activity.PropertyCrossActivity;
import com.propertycross.mgwt.activity.SearchResultsActivity;

public class SearchResultsPage extends PageBase {

  private final SearchResultsView view;

  public SearchResultsPage() {
    super(true);
    view = new SearchResultsView();
    addBodyContent(view, false);
  }
  
  public SearchResultsActivity.View getView() {
  	return view;
  }
}
