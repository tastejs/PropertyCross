package com.propertycross.mgwt.page;

import com.propertycross.mgwt.view.PropertyCrossView;
import com.propertycross.mgwt.activity.PropertyCrossActivity;

public class PropertyCrossPage extends PageBase {

  private final PropertyCrossView view;

  public PropertyCrossPage() {
    super(false);
    view = new PropertyCrossView();
    addBodyContent(view, false);
  }
  
  public PropertyCrossActivity.View getView() {
  	return view;
  }
}
