package com.propertycross.mgwt.activity;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.googlecode.mgwt.mvp.client.MGWTAbstractActivity;
import com.propertycross.mgwt.MgwtAppEntryPoint;
import com.propertycross.mgwt.activity.searchitem.SearchItemBase;
import com.propertycross.mgwt.locations.Location;
import com.propertycross.mgwt.nestoria.RequestSender;
import com.propertycross.mgwt.nestoria.Response.ListingsFound;
import com.propertycross.mgwt.page.SearchResultsPage;
import com.propertycross.mgwt.place.PropertyPlace;
import com.propertycross.mgwt.place.SearchResultsPlace;
import com.propertycross.mgwt.properties.Property;

/**
 * An activity which renders a collection of search results.
 * @author ceberhardt
 *
 */
public class SearchResultsActivity extends MGWTAbstractActivity {

	private final SearchResultsPage page = new SearchResultsPage();

	private final SearchResultsPlace place;
	
	private ArrayList<Property> properties;

	private View view;

	/**
	 * The interface this activity requires from the associated view.
	 */
	public interface View extends AbstractView<ViewEventHandler> {

		/**
		 * Supplies the search results and meta-data.
		 */
		void setSearchResult(int totalResult, int pageNumber, int totalPages, List<Property> properties,
		    String searchLocation);

		/**
		 * Sets whether a 'load more' button should be displayed
		 */
		void setLoadMoreVisible(boolean visible);

	}

	public interface ViewEventHandler {
		void propertySelected(Property property);

		void loadMoreClicked();
	}

	private final ViewEventHandler viewEventHandler = new ViewEventHandler() {

		@Override
		public void propertySelected(Property property) {
			handlePropertySelected(property);
		}

		@Override
		public void loadMoreClicked() {
			handleLoadMoreClicked();
		}

	};

	public SearchResultsActivity(SearchResultsPlace place) {
		this.place = place;
		this.properties = new ArrayList<Property>(place.getListingsResponse().getListings());
	}

	@Override
	public void start(AcceptsOneWidget panel, EventBus eventBus) {
		view = page.getView();
		view.setEventHandler(viewEventHandler);

		ListingsFound listingsResponse = this.place.getListingsResponse();
		view.setSearchResult(listingsResponse.getTotalResults(), listingsResponse.getPage(), listingsResponse
		    .getTotalPages(), this.properties, listingsResponse.getLocation().getDisplayName());
		view.setLoadMoreVisible(listingsResponse.getPage() < listingsResponse.getTotalPages());

		panel.setWidget(page);
	}

	private void handlePropertySelected(Property property) {
		MgwtAppEntryPoint.placeController.goTo(new PropertyPlace(property));
	}

	private void handleLoadMoreClicked() {
		SearchItemBase searchItem = this.place.getSearchItem();
		searchItem.setPageNumber(searchItem.getPageNumber() + 1);
		searchItem.doQuery(new QueryCallback());
	}

	private final class QueryCallback implements RequestSender.Callback {

		public QueryCallback() {
		}

		@Override
		public void onTimeout() {
			// view.setIsLoading(false);
			// view.setMessage("An error occurred while searching. Please check your network connection and try again.");
		}

		@Override
		public void onResultsFound(ListingsFound response) {
			properties.addAll(response.getListings());
			view.setSearchResult(response.getTotalResults(), response.getPage(), response
			    .getTotalPages(), properties, response.getLocation().getDisplayName());
			view.setLoadMoreVisible(response.getPage() < response.getTotalPages());
			
			// view.setIsLoading(false);
			// MgwtAppEntryPoint.placeController.goTo(new SearchResultsPlace(response,
			// searchItem));
		}

		@Override
		public void onNoLocation(List<Location> suggested) {
			// view.setIsLoading(false);
			// view.setMessage("Please select a location below:");
			// view.displaySuggestedLocations(suggested);
		}

		@Override
		public void onNoLocation() {
			// view.setIsLoading(false);
			// view.setMessage("The location given was not recognised.");
		}

		@Override
		public void onError(Throwable t) {
			// view.setIsLoading(false);
			// view.setMessage("An error occurred while searching. Please check your network connection and try again.");
		}
	};
}
