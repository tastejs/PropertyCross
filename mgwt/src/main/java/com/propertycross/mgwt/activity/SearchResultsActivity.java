package com.propertycross.mgwt.activity;

import java.util.List;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.googlecode.mgwt.mvp.client.MGWTAbstractActivity;
import com.propertycross.mgwt.locations.Location;
import com.propertycross.mgwt.nestoria.QueryBuilder;
import com.propertycross.mgwt.nestoria.RequestSender;
import com.propertycross.mgwt.nestoria.gwt.GwtRequestSender;
import com.propertycross.mgwt.page.PropertyCrossPage;
import com.propertycross.mgwt.page.SearchResultsPage;
import com.propertycross.mgwt.properties.Property;

public class SearchResultsActivity extends MGWTAbstractActivity {

	private final SearchResultsPage page = new SearchResultsPage();
	
	private View view;
	
	public interface View extends AbstractView<ViewEventHandler> {
		
	}

	public interface ViewEventHandler {
		
	}
	
	private final ViewEventHandler viewEventHandler = new ViewEventHandler() {

		
	};

	@Override
	public void start(AcceptsOneWidget panel, EventBus eventBus) {
		view = page.getView();
		view.setEventHandler(viewEventHandler);
		panel.setWidget(page);
	}	


}
