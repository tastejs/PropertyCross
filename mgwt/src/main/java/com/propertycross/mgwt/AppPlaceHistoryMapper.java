package com.propertycross.mgwt;

import com.google.gwt.place.shared.PlaceHistoryMapper;
import com.google.gwt.place.shared.WithTokenizers;
import com.propertycross.mgwt.place.PropertyCrossPlace.PropertyCrossPlaceTokenizer;
import com.propertycross.mgwt.place.SearchResultsPlace.SearchResultsPlaceTokenizer;

@WithTokenizers({ PropertyCrossPlaceTokenizer.class, SearchResultsPlaceTokenizer.class })
public interface AppPlaceHistoryMapper extends PlaceHistoryMapper {
}
