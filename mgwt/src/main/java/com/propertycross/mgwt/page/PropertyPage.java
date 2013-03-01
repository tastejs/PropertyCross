package com.propertycross.mgwt.page;

import com.propertycross.mgwt.activity.PropertyActivity;
import com.propertycross.mgwt.view.PropertyView;

public class PropertyPage extends PageBase {

  private final PropertyView view;
  

  public PropertyPage() {
    super(true, true, "Property Details");
    
    favouritesButton.setText("+");
	  
    view = new PropertyView(this);
    addContent(view);
  }
  
  public PropertyActivity.View getView() {
  	return view;
  }
}
