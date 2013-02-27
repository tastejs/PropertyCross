package com.propertycross.mgwt.activity;

import java.util.List;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.googlecode.mgwt.mvp.client.MGWTAbstractActivity;
import com.propertycross.mgwt.MgwtAppEntryPoint;
import com.propertycross.mgwt.locations.Location;
import com.propertycross.mgwt.nestoria.QueryBuilder;
import com.propertycross.mgwt.nestoria.RequestSender;
import com.propertycross.mgwt.nestoria.gwt.GwtRequestSender;
import com.propertycross.mgwt.page.PropertyCrossPage;
import com.propertycross.mgwt.place.SearchResultsPlace;
import com.propertycross.mgwt.properties.Property;

public class PropertyCrossActivity extends MGWTAbstractActivity {

	private String searchText;

	private final RequestSender requestSender = new GwtRequestSender();
	
	private final PropertyCrossPage page = new PropertyCrossPage();
	
	private View view;
	
	public interface View extends AbstractView<ViewEventHandler> {
		/**
		 * Supplies a message to the user, typically to indicate an error or
		 * problem.
		 */
		void setMessage(String message);
	}

	public interface ViewEventHandler {
		void searchButtonClicked();

		void searchTextChanged(String searchText);
	}
	
	private final ViewEventHandler viewEventHandler = new ViewEventHandler() {

		@Override
		public void searchButtonClicked() {
			searchForProperties();
		}

		@Override
		public void searchTextChanged(String newSearchText) {
			searchText = newSearchText;
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
  	view.setMessage("");
  	QueryBuilder q = new QueryBuilder(requestSender);
    q.setPlaceName(searchText);
    q.doQuery(new QueryCallback(q));
  }

	private final class QueryCallback implements RequestSender.Callback {

		private final QueryBuilder query;

		public QueryCallback(QueryBuilder query) {
			this.query = query;
		}

		@Override
		public void onTimeout() {
			Window.alert("req timeout");
		}

		@Override
		public void onResultsFound(List<Property> results, Location location,
		    int page, int totalResults) {
			view.setMessage("found some properties: " + results.size());
			MgwtAppEntryPoint.placeController.goTo(new SearchResultsPlace());
		}

		@Override
		public void onNoLocation(List<Location> suggested) {
			Window.alert("no location");
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
