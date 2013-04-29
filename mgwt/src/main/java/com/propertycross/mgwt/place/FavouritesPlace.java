package com.propertycross.mgwt.place;

import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceTokenizer;

public class FavouritesPlace extends Place {
	
	public static class FavouritesPlaceTokenizer implements PlaceTokenizer<FavouritesPlace> {

    @Override
    public FavouritesPlace getPlace(String token) {
      return new FavouritesPlace();
    }

    @Override
    public String getToken(FavouritesPlace place) {
      return "";
    }
  }
}
