package com.propertycross.mgwt.place;

import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceTokenizer;
import com.propertycross.mgwt.nestoria.Response.ListingsFound;

public class SearchResultsPlace extends Place {
	
	private final ListingsFound listingsResponse;
	
	public SearchResultsPlace(ListingsFound results) {
		this.listingsResponse = results;
	}
	
	public ListingsFound getListingsResponse() {
  	return listingsResponse;
  }
	
  public static class SearchResultsPlaceTokenizer implements PlaceTokenizer<SearchResultsPlace> {

    @Override
    public SearchResultsPlace getPlace(String token) {
      return new SearchResultsPlace(null);
    }

    @Override
    public String getToken(SearchResultsPlace place) {
      return "";
    }
  }
}
