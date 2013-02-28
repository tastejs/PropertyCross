package com.propertycross.mgwt.place;

import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceTokenizer;
import com.propertycross.mgwt.properties.Property;

public class PropertyPlace extends Place {
	
	private final Property property;
	
  public Property getProperty() {
  	return property;
  }

	public PropertyPlace(Property property) {
	  this.property = property;
  }

	public static class PropertyPlaceTokenizer implements PlaceTokenizer<PropertyPlace> {

    @Override
    public PropertyPlace getPlace(String token) {
    	// TODO: WTF?
      return new PropertyPlace(null);
    }

    @Override
    public String getToken(PropertyPlace place) {
      return "";
    }
  }
}
