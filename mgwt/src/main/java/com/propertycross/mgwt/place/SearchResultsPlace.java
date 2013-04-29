package com.propertycross.mgwt.place;

import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceTokenizer;
import com.propertycross.mgwt.activity.searchitem.SearchItemBase;
import com.propertycross.mgwt.nestoria.Response.ListingsFound;

public class SearchResultsPlace extends Place {
	
	private ListingsFound listingsResponse;
	
	private SearchItemBase searchItem;
	
	public SearchResultsPlace(ListingsFound results, SearchItemBase searchItem) {
		this.listingsResponse = results;
		this.searchItem = searchItem;
	}
	
	public SearchResultsPlace() {
  }

	public ListingsFound getListingsResponse() {
  	return listingsResponse;
  }
	
	public SearchItemBase getSearchItem() {
  	return searchItem;
  }
		
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
