package com.propertycross.mgwt;

import com.google.gwt.activity.shared.Activity;
import com.google.gwt.activity.shared.ActivityMapper;
import com.google.gwt.place.shared.Place;
import com.propertycross.mgwt.activity.PropertyCrossActivity;
import com.propertycross.mgwt.activity.SearchResultsActivity;
import com.propertycross.mgwt.place.SearchResultsPlace;

public class PhoneActivityMapper implements ActivityMapper {

  @Override
  public Activity getActivity(Place place) {

    if (place instanceof SearchResultsPlace) {
      return new SearchResultsActivity();
    } 

    return new PropertyCrossActivity();

  }
}
