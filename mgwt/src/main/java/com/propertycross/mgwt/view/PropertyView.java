package com.propertycross.mgwt.view;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Image;
import com.google.gwt.user.client.ui.Widget;
import com.propertycross.mgwt.activity.PropertyActivity;
import com.propertycross.mgwt.activity.PropertyActivity.ViewEventHandler;
import com.propertycross.mgwt.properties.Property;

public class PropertyView extends Composite implements PropertyActivity.View{

	private static PropertyViewUiBinder uiBinder = GWT.create(PropertyViewUiBinder.class);

	interface PropertyViewUiBinder extends UiBinder<Widget, PropertyView> {
	}

	public PropertyView() {
		initWidget(uiBinder.createAndBindUi(this));
	}
	
	@UiField
	Element propertyPrice;
	@UiField
	Element propertyTitle;
	@UiField
	Element propertyStats;
	@UiField
	Element propertySummary;
	@UiField
	Image propertyImage;
	
	public PropertyView(String firstName) {
		initWidget(uiBinder.createAndBindUi(this));
	}


	@Override
  public void setEventHandler(ViewEventHandler eventHandler) {
	  // TODO Auto-generated method stub
	  
  }

	@Override
  public void setProperty(Property property) {
	  propertyPrice.setInnerHTML(property.formattedPrice());
	  propertyTitle.setInnerHTML(property.title());
	  propertyStats.setInnerHTML(property.bedBathroomText());
	  propertySummary.setInnerHTML(property.summary());
	  propertyImage.setUrl(property.imgUrl());
  }
}
