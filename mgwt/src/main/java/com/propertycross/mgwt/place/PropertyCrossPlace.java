package com.propertycross.mgwt.place;

import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceTokenizer;

public class PropertyCrossPlace extends Place {
  public static class PropertyCrossPlaceTokenizer implements PlaceTokenizer<PropertyCrossPlace> {

    @Override
    public PropertyCrossPlace getPlace(String token) {
      return new PropertyCrossPlace();
    }

    @Override
    public String getToken(PropertyCrossPlace place) {
      return "";
    }
  }
}
