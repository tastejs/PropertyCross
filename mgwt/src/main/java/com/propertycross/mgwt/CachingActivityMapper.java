package com.propertycross.mgwt;

import java.util.Dictionary;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.gwt.activity.shared.Activity;
import com.google.gwt.activity.shared.ActivityMapper;
import com.google.gwt.place.shared.Place;
import com.propertycross.mgwt.activity.PropertyActivity;
import com.propertycross.mgwt.activity.PropertyCrossActivity;
import com.propertycross.mgwt.activity.SearchResultsActivity;
import com.propertycross.mgwt.place.PropertyCrossPlace;
import com.propertycross.mgwt.place.SearchResultsPlace;

public class CachingActivityMapper implements ActivityMapper {

	private Activity propertyCrossActivity;
	
	private Activity searchResultsActivity;
	
	
	private final ActivityMapper wrappedActivityMapper;
			
	public CachingActivityMapper(ActivityMapper wrappedActivityMapper) {
	  super();
	  this.wrappedActivityMapper = wrappedActivityMapper;
  }

	@Override
  public Activity getActivity(Place place) {
		if (place instanceof PropertyCrossPlace) {
			if (propertyCrossActivity == null) {
				propertyCrossActivity = wrappedActivityMapper.getActivity(place);
			}
			searchResultsActivity = null;
			return propertyCrossActivity;
		}
		
		if (place instanceof SearchResultsPlace) {
			if (searchResultsActivity == null) {
				searchResultsActivity = wrappedActivityMapper.getActivity(place);
			}
			return searchResultsActivity;
		}
		
		return wrappedActivityMapper.getActivity(place);
		
  }

}
