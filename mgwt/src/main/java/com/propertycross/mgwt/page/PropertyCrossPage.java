package com.propertycross.mgwt.page;

import com.propertycross.mgwt.activity.PropertyCrossActivity;
import com.propertycross.mgwt.view.PropertyCrossView;

public class PropertyCrossPage extends PageBase {

  private final PropertyCrossView view;
  
  public PropertyCrossPage() {
    super(false, true, "PropertyCross");
    
    favouritesButton.setText("Fave");
	  
    view = new PropertyCrossView(this);
    addContent(view);
  }
  
  public PropertyCrossActivity.View getView() {
  	return view;
  }
}
