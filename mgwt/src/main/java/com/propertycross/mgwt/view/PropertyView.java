package com.propertycross.mgwt.view;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Image;
import com.google.gwt.user.client.ui.Widget;
import com.propertycross.mgwt.activity.PropertyActivity;
import com.propertycross.mgwt.activity.PropertyActivity.ViewEventHandler;
import com.propertycross.mgwt.page.PageBase;
import com.propertycross.mgwt.properties.Property;

public class PropertyView extends ViewBase implements PropertyActivity.View{

	private static PropertyViewUiBinder uiBinder = GWT.create(PropertyViewUiBinder.class);
	
	private ViewEventHandler eventHandler;

	interface PropertyViewUiBinder extends UiBinder<Widget, PropertyView> {
	}

	public PropertyView(PageBase pageBase) {
		super(pageBase);
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
	

	@Override
  public void setEventHandler(ViewEventHandler eventHandler) {
	  this.eventHandler = eventHandler;
  }

	@Override
  public void setProperty(Property property) {
	  propertyPrice.setInnerHTML(property.formattedPrice());
	  propertyTitle.setInnerHTML(property.title());
	  propertyStats.setInnerHTML(property.bedBathroomText());
	  propertySummary.setInnerHTML(property.summary());
	  propertyImage.setUrl(property.imgUrl());
  }

	@Override
  public void setFavourited(boolean isFavourited) {
	  pageBase.setFavouriteButtonText(isFavourited ? "-" : "+");
  }
	
	@Override
	public void favouriteClicked() {
	  super.favouriteClicked();
	  this.eventHandler.toggleFavouriteState();
	}
}
