package com.propertycross.mgwt.page;

import com.propertycross.mgwt.view.PropertyCrossView;
import com.propertycross.mgwt.view.PropertyView;
import com.propertycross.mgwt.view.SearchResultsView;
import com.propertycross.mgwt.activity.PropertyActivity;
import com.propertycross.mgwt.activity.PropertyCrossActivity;
import com.propertycross.mgwt.activity.SearchResultsActivity;

public class PropertyPage extends PageBase {

  private final PropertyView view;

  public PropertyPage() {
    super(true);
    view = new PropertyView();
    addBodyContent(view, false);
  }
  
  public PropertyActivity.View getView() {
  	return view;
  }
}
