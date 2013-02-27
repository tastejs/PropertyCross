package com.propertycross.mgwt;

import com.google.gwt.activity.shared.Activity;
import com.google.gwt.activity.shared.ActivityMapper;
import com.google.gwt.place.shared.Place;
import com.propertycross.mgwt.activity.PropertyActivity;
import com.propertycross.mgwt.activity.PropertyCrossActivity;
import com.propertycross.mgwt.activity.SearchResultsActivity;
import com.propertycross.mgwt.place.PropertyPlace;
import com.propertycross.mgwt.place.SearchResultsPlace;

public class PhoneActivityMapper implements ActivityMapper {

  @Override
  public Activity getActivity(Place place) {

    if (place instanceof SearchResultsPlace) {
      return new SearchResultsActivity((SearchResultsPlace)place);
    } else if (place instanceof PropertyPlace) {
      return new PropertyActivity((PropertyPlace)place);
    } 

    return new PropertyCrossActivity();
  }
}
