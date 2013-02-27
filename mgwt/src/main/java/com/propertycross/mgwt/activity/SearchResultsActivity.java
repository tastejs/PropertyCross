package com.propertycross.mgwt.activity;

import java.util.List;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.googlecode.mgwt.mvp.client.MGWTAbstractActivity;
import com.propertycross.mgwt.Cache;
import com.propertycross.mgwt.MgwtAppEntryPoint;
import com.propertycross.mgwt.locations.Location;
import com.propertycross.mgwt.nestoria.QueryBuilder;
import com.propertycross.mgwt.nestoria.RequestSender;
import com.propertycross.mgwt.nestoria.Response.ListingsFound;
import com.propertycross.mgwt.nestoria.gwt.GwtRequestSender;
import com.propertycross.mgwt.page.PropertyCrossPage;
import com.propertycross.mgwt.page.SearchResultsPage;
import com.propertycross.mgwt.place.PropertyPlace;
import com.propertycross.mgwt.place.SearchResultsPlace;
import com.propertycross.mgwt.properties.Property;

public class SearchResultsActivity extends MGWTAbstractActivity {

	private final SearchResultsPage page = new SearchResultsPage();

	private final SearchResultsPlace place;

	private View view;

	public interface View extends AbstractView<ViewEventHandler> {
		void setSearchResult(int totalResult, int pageNumber, int totalPages, List<Property> properties,
		    String searchLocation);
		
	}

	public interface ViewEventHandler {
		void propertySelected(Property property);
	}

	private final ViewEventHandler viewEventHandler = new ViewEventHandler() {

		@Override
    public void propertySelected(Property property) {
	    handlePropertySelected(property);
    }

	};

	public SearchResultsActivity(SearchResultsPlace place) {
		this.place = place;
	}

	@Override
	public void start(AcceptsOneWidget panel, EventBus eventBus) {
		view = page.getView();
		view.setEventHandler(viewEventHandler);

		ListingsFound listingsResponse = this.place.getListingsResponse();
		
		if (listingsResponse!=null) {
			Cache.LISTINGS_FOUND = listingsResponse;
		} else {
			listingsResponse = Cache.LISTINGS_FOUND;
		}
		
		view.setSearchResult(listingsResponse.getTotalResults(), listingsResponse.getPage(),
		    listingsResponse.getTotalPages(), listingsResponse.getListings(), listingsResponse.getListings().toString());
		
		panel.setWidget(page);
	}

	private void handlePropertySelected(Property property) {
		MgwtAppEntryPoint.placeController.goTo(new PropertyPlace(property));
	}
}
