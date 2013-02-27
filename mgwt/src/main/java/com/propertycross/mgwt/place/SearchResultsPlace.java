package com.propertycross.mgwt.place;

import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceTokenizer;

public class SearchResultsPlace extends Place {
  public static class SearchResultsPlaceTokenizer implements PlaceTokenizer<SearchResultsPlace> {

    @Override
    public SearchResultsPlace getPlace(String token) {
      return new SearchResultsPlace();
    }

    @Override
    public String getToken(SearchResultsPlace place) {
      return "";
    }
  }
}
