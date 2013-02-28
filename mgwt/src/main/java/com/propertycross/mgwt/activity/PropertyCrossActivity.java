package com.propertycross.mgwt.activity;

import java.util.List;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.googlecode.mgwt.mvp.client.MGWTAbstractActivity;
import com.propertycross.mgwt.MgwtAppEntryPoint;
import com.propertycross.mgwt.activity.searchitem.PlainTextSearchItem;
import com.propertycross.mgwt.activity.searchitem.SearchItemBase;
import com.propertycross.mgwt.locations.Location;
import com.propertycross.mgwt.nestoria.RequestSender;
import com.propertycross.mgwt.nestoria.Response.ListingsFound;
import com.propertycross.mgwt.page.PropertyCrossPage;
import com.propertycross.mgwt.place.SearchResultsPlace;

public class PropertyCrossActivity extends MGWTAbstractActivity {

	private SearchItemBase searchItem;

	private final PropertyCrossPage page = new PropertyCrossPage();

	private View view;

	/**
	 * The interface this activity requires from the associated view.
	 */
	public interface View extends AbstractView<ViewEventHandler> {
		/**
		 * Supplies a message to the user, typically to indicate an error or
		 * problem.
		 */
		void setMessage(String message);

		/**
		 * Sets whether to display a loading indicator
		 */
		void setIsLoading(boolean isLoading);

		/**
		 * Displays a list of suggested locations when the user supplies a
		 * plain-text search.
		 */
		void displaySuggestedLocations(List<Location> locations);
	}

	public interface ViewEventHandler {
		void searchButtonClicked();

		void searchTextChanged(String searchText);

		void locationSelected(Location location);
	}

	private final ViewEventHandler viewEventHandler = new ViewEventHandler() {

		@Override
		public void searchButtonClicked() {
			searchForProperties();
		}

		@Override
		public void searchTextChanged(String newSearchText) {
			searchItem = new PlainTextSearchItem(newSearchText);
		}

		@Override
		public void locationSelected(Location location) {
			searchItem = new PlainTextSearchItem(location.getDisplayName(), location.getName());
			searchForProperties();
		}
	};

	@Override
	public void start(AcceptsOneWidget panel, EventBus eventBus) {

		view = page.getView();
		view.setEventHandler(viewEventHandler);
		panel.setWidget(page);
	}

	private void searchForProperties() {
		view.setIsLoading(true);
		view.setMessage("");

		searchItem.doQuery(new QueryCallback());
	}

	private final class QueryCallback implements RequestSender.Callback {

		public QueryCallback() {
		}

		@Override
		public void onTimeout() {
			view.setIsLoading(false);
			view.setMessage("An error occurred while searching. Please check your network connection and try again.");
		}

		@Override
		public void onResultsFound(ListingsFound response) {
			view.setIsLoading(false);
			MgwtAppEntryPoint.placeController.goTo(new SearchResultsPlace(response, searchItem));
		}

		@Override
		public void onNoLocation(List<Location> suggested) {
			view.setIsLoading(false);
			view.setMessage("Please select a location below:");
			view.displaySuggestedLocations(suggested);
		}

		@Override
		public void onNoLocation() {
			view.setIsLoading(false);
			view.setMessage("The location given was not recognised.");
		}

		@Override
		public void onError(Throwable t) {
			view.setIsLoading(false);
			view.setMessage("An error occurred while searching. Please check your network connection and try again.");
		}
	};
}
