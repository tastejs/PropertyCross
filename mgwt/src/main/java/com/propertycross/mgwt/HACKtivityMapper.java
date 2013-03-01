package com.propertycross.mgwt;

import com.google.gwt.activity.shared.Activity;
import com.google.gwt.activity.shared.ActivityMapper;
import com.google.gwt.place.shared.Place;
import com.propertycross.mgwt.place.FavouritesPlace;
import com.propertycross.mgwt.place.PropertyCrossPlace;
import com.propertycross.mgwt.place.SearchResultsPlace;

public class HACKtivityMapper implements ActivityMapper {

	private Activity propertyCrossActivity;
	
	private Activity searchResultsActivity;
	
	private Activity favouritesActivity;
	
	private final ActivityMapper wrappedActivityMapper;
			
	public HACKtivityMapper(ActivityMapper wrappedActivityMapper) {
	  super();
	  this.wrappedActivityMapper = wrappedActivityMapper;
  }

	@Override
  public Activity getActivity(Place place) {
		if (place instanceof PropertyCrossPlace) {
			if (propertyCrossActivity == null) {
				propertyCrossActivity = wrappedActivityMapper.getActivity(place);
			}
			searchResultsActivity = favouritesActivity = null;
			return propertyCrossActivity;
		}
		
		if (place instanceof SearchResultsPlace) {
			if (searchResultsActivity == null) {
				searchResultsActivity = wrappedActivityMapper.getActivity(place);
			}
			return searchResultsActivity;
		}
		
		if (place instanceof FavouritesPlace) {
			if (favouritesActivity == null) {
				favouritesActivity = wrappedActivityMapper.getActivity(place);
			}
			return favouritesActivity;
		}
		
		return wrappedActivityMapper.getActivity(place);
		
  }

}
