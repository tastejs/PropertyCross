package com.propertycross.mgwt.activity;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.googlecode.mgwt.mvp.client.MGWTAbstractActivity;
import com.propertycross.mgwt.MgwtAppEntryPoint;
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
		
		void setFavourited(boolean isFavourited);
	}

	public interface ViewEventHandler {
		void toggleFavouriteState();
	}

	private final ViewEventHandler viewEventHandler = new ViewEventHandler() {
		@Override
    public void toggleFavouriteState() {
	    handleToggleFavouriteState();
    }
	};

	public PropertyActivity(PropertyPlace place) {
		this.place = place;
	}

	protected void handleToggleFavouriteState() {
		Property property = place.getProperty();
	  if (MgwtAppEntryPoint.propertiesManager.isFavourite(property)) {
	  	MgwtAppEntryPoint.propertiesManager.removeFavourite(property);
	  } else {
	  	MgwtAppEntryPoint.propertiesManager.addFavourite(property);
	  }
	  view.setFavourited(MgwtAppEntryPoint.propertiesManager.isFavourite(property));
  }

	@Override
	public void start(AcceptsOneWidget panel, EventBus eventBus) {
		view = page.getView();
		view.setEventHandler(viewEventHandler);
		Property property = place.getProperty();
		view.setProperty(property);
		view.setFavourited(MgwtAppEntryPoint.propertiesManager.isFavourite(property));
		panel.setWidget(page);
	}

}
