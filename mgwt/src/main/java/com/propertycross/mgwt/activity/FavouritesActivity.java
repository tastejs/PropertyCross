package com.propertycross.mgwt.activity;

import java.util.List;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.googlecode.mgwt.mvp.client.MGWTAbstractActivity;
import com.propertycross.mgwt.MgwtAppEntryPoint;
import com.propertycross.mgwt.page.FavouritesPage;
import com.propertycross.mgwt.place.PropertyPlace;
import com.propertycross.mgwt.properties.Property;

public class FavouritesActivity extends MGWTAbstractActivity {

	private final FavouritesPage page = new FavouritesPage();

	private View view;

	/**
	 * The interface this activity requires from the associated view.
	 */
	public interface View extends AbstractView<ViewEventHandler> {
		void setFavourites(List<Property> properties);
		
	}

	public interface ViewEventHandler {
		void propertySelected(Property property);
	}

	private final ViewEventHandler viewEventHandler = new ViewEventHandler() {

		@Override
    public void propertySelected(Property property) {
			MgwtAppEntryPoint.placeController.goTo(new PropertyPlace(property));
    }
		
	};

	public FavouritesActivity() {
	}



	@Override
	public void start(AcceptsOneWidget panel, EventBus eventBus) {
		view = page.getView();		
		view.setEventHandler(viewEventHandler);
		view.setFavourites(MgwtAppEntryPoint.propertiesManager.loadFavourites());
		panel.setWidget(page);
	}

}
