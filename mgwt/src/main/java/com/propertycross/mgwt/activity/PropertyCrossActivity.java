package com.propertycross.mgwt.activity;

import java.util.List;

import com.google.gwt.core.client.Callback;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.geolocation.client.Geolocation;
import com.google.gwt.geolocation.client.Position.Coordinates;
import com.google.gwt.geolocation.client.PositionError;
import com.google.gwt.geolocation.client.Position;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.googlecode.mgwt.mvp.client.MGWTAbstractActivity;
import com.propertycross.mgwt.MgwtAppEntryPoint;
import com.propertycross.mgwt.activity.searchitem.GeolocationSearchItem;
import com.propertycross.mgwt.activity.searchitem.PlainTextSearchItem;
import com.propertycross.mgwt.activity.searchitem.SearchItemBase;
import com.propertycross.mgwt.locations.Location;
import com.propertycross.mgwt.locations.Search;
import com.propertycross.mgwt.nestoria.RequestSender;
import com.propertycross.mgwt.nestoria.Response.ListingsFound;
import com.propertycross.mgwt.page.PropertyCrossPage;
import com.propertycross.mgwt.place.FavouritesPlace;
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

		/**
		 * Displays a list of recently performed searches.
		 */
		void displayRecentSearches(List<Search> recentSearches);

		/**
		 * Sets the text displayed in the search field.
		 */
		void setSearchText(String searchText);
	}

	public interface ViewEventHandler {
		void searchButtonClicked();
		
		void myLocationButtonClicked();

		void searchTextChanged(String searchText);

		void locationSelected(Location location);

		void recentSearchSelected(Search search);

		void favouritesClicked();
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
			view.displaySuggestedLocations(null);
			searchItem = new PlainTextSearchItem(location.getDisplayName(), location.getName());
			searchForProperties();
		}

		@Override
		public void recentSearchSelected(Search search) {
			if (search.searchText().startsWith(GeolocationSearchItem.SEARCH_PREFIX)) {
				String latLon = search.searchText().substring(4);
				String[] components = latLon.split(",");
				searchItem = new GeolocationSearchItem(Double.parseDouble(components[0]), Double.parseDouble(components[1]));
			}
			else {
				searchItem = new PlainTextSearchItem(search.displayText(), search.searchText());
			}
			view.setSearchText(searchItem.getDisplayText());
			searchForProperties();
		}

		@Override
		public void favouritesClicked() {
			MgwtAppEntryPoint.placeController.goTo(new FavouritesPlace());
		}

		@Override
    public void myLocationButtonClicked() {
	    handleLocationButtonClicked();
    }

	};

	@Override
	public void start(AcceptsOneWidget panel, EventBus eventBus) {
		view = page.getView();
		view.setEventHandler(viewEventHandler);
		view.displayRecentSearches(MgwtAppEntryPoint.searchesManager.recentSearches());
		panel.setWidget(page);
	}

	private void searchForProperties() {
		view.setIsLoading(true);
		view.setMessage("");
		searchItem.doQuery(new QueryCallback());
	}
	
	private void handleLocationButtonClicked() {
		 Geolocation g = Geolocation.getIfSupported();
		 view.setMessage("Finding location ...");
     g.getCurrentPosition(new Callback<Position, PositionError>() {

         @Override public void onSuccess(final Position result)
         {
        	 view.setMessage("");
        	 Coordinates coordinates = result.getCoordinates();
           searchItem = new GeolocationSearchItem(coordinates.getLatitude(), coordinates.getLongitude());
           searchItem.doQuery(new QueryCallback());
         }

         @Override public void onFailure(PositionError ex)
         {
        	 view.setMessage("Unable to detect location.");
         }

     });
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
			MgwtAppEntryPoint.searchesManager.add(searchItem.createPersistentSearch(response.getTotalResults()));
			view.displayRecentSearches(MgwtAppEntryPoint.searchesManager.recentSearches());
			MgwtAppEntryPoint.placeController.goTo(new SearchResultsPlace(response, searchItem));
		}

		@Override
		public void onNoLocation(List<Location> suggested) {
			view.setIsLoading(false);
			view.displayRecentSearches(null);
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
