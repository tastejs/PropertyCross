package com.propertycross.neomad.services;

import com.neomades.app.Application;
import com.neomades.event.Event;
import com.neomades.event.EventReceiver;
import com.propertycross.neomad.Constants;
import com.propertycross.neomad.model.search.LocationSearch;
import com.propertycross.neomad.model.search.Search;

public class PropertyCrossEventReceiver implements EventReceiver {

	public void onReceiveEvent(Event event) {
		// SearchEvent : find by location name
		if (event.hasType(Constants.FIND_BY_NAME)) {
			String locationName = ((Search) event.getValue())
					.getQuery();
			int page = ((Search) event.getValue()).getPage();
			PropertyListQuery query = new PropertyListQuery(locationName,
					new Integer(page));
			Application.getCurrent().getContentManager().postQuery(query);
		}
		
		// SearchEvent : find by location coordinates
		else if (event.hasType(Constants.FIND_BY_LOCATION)){
			LocationSearch value = (LocationSearch) event.getValue();
			PropertyListQuery query = new PropertyListQuery(value.getLatitude(), value.getLongitude(), new Integer(value.getPage()));
			Application.getCurrent().getContentManager().postQuery(query);
		}

	}

}
