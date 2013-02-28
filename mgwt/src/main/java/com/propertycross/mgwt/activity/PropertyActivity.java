package com.propertycross.mgwt.activity;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.googlecode.mgwt.mvp.client.MGWTAbstractActivity;
import com.propertycross.mgwt.page.PropertyPage;
import com.propertycross.mgwt.place.PropertyPlace;
import com.propertycross.mgwt.properties.Property;

public class PropertyActivity extends MGWTAbstractActivity {

	private final PropertyPage page = new PropertyPage();

	private final PropertyPlace place;

	private View view;

	/**
	 * The interface this activity requires from the associated view.
	 */
	public interface View extends AbstractView<ViewEventHandler> {
		void setProperty(Property property);
	}

	public interface ViewEventHandler {
	}

	private final ViewEventHandler viewEventHandler = new ViewEventHandler() {

	};

	public PropertyActivity(PropertyPlace place) {
		this.place = place;
	}

	@Override
	public void start(AcceptsOneWidget panel, EventBus eventBus) {
		view = page.getView();
		view.setEventHandler(viewEventHandler);
		view.setProperty(place.getProperty());
		panel.setWidget(page);
	}

}