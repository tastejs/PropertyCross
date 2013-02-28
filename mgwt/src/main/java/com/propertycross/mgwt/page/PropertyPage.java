package com.propertycross.mgwt.page;

import com.propertycross.mgwt.activity.PropertyActivity;
import com.propertycross.mgwt.view.PropertyView;

public class PropertyPage extends PageBase {

  private final PropertyView view;

  public PropertyPage() {
    super(true);
    view = new PropertyView(this);
    addBodyContent(view, false);
  }
  
  public PropertyActivity.View getView() {
  	return view;
  }
}
