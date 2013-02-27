package com.propertycross.mgwt.activity;

import java.util.List;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.googlecode.mgwt.mvp.client.MGWTAbstractActivity;
import com.propertycross.mgwt.MgwtAppEntryPoint;
import com.propertycross.mgwt.activity.searchitem.PlainTextSearchItem;
import com.propertycross.mgwt.activity.searchitem.SearchItemBase;
import com.propertycross.mgwt.locations.Location;
import com.propertycross.mgwt.nestoria.QueryBuilder;
import com.propertycross.mgwt.nestoria.RequestSender;
import com.propertycross.mgwt.nestoria.Response.ListingsFound;
import com.propertycross.mgwt.nestoria.gwt.GwtRequestSender;
import com.propertycross.mgwt.page.PropertyCrossPage;
import com.propertycross.mgwt.place.SearchResultsPlace;
import com.propertycross.mgwt.properties.Property;

public class PropertyCrossActivity extends MGWTAbstractActivity {

	private String searchText;

	private SearchItemBase searchItem;
	
	private final PropertyCrossPage page = new PropertyCrossPage();
	
	private View view;
	
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
		 * Displays a list of suggested locations when the user supplies a plain-text search.
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

	private void searchForProperties()
  {
		view.setIsLoading(true);
  	view.setMessage("");
  	
  	searchItem.doQuery(new QueryCallback());
  }

	private final class QueryCallback implements RequestSender.Callback {

		public QueryCallback() {
		}

		@Override
		public void onTimeout() {
			Window.alert("req timeout");
		}

		@Override
		public void onResultsFound(ListingsFound response) {
			
			view.setIsLoading(false);
			
			MgwtAppEntryPoint.placeController.goTo(new SearchResultsPlace(response));
		}

		@Override
		public void onNoLocation(List<Location> suggested) {
			view.displaySuggestedLocations(suggested);
		}

		@Override
		public void onNoLocation() {
			Window.alert("no location");
		}

		@Override
		public void onError(Throwable t) {
			Window.alert(t.getMessage());
		}


	};

	


}
