package com.propertycross.mgwt.page;

import com.propertycross.mgwt.activity.PropertyCrossActivity;
import com.propertycross.mgwt.view.PropertyCrossView;

public class PropertyCrossPage extends PageBase {

  private final PropertyCrossView view;

  public PropertyCrossPage() {
    super(false, "PropertyCross");
    view = new PropertyCrossView(this);
    addBodyContent(view, false);
  }
  
  public PropertyCrossActivity.View getView() {
  	return view;
  }
}
