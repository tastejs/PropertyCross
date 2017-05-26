package com.propertycross.android.presenter;

import java.util.List;

import com.propertycross.android.events.Callback;
import com.propertycross.android.events.PropertyEventArgs;
import com.propertycross.android.events.PropertySelectedEvent;
import com.propertycross.android.model.Property;

public class FavouritesPresenter {

	public interface View {
		void setFavourites(List<Property> properties);
		void propertySelected(Callback<PropertySelectedEvent> callback);
	}

	private PropertyFinderPersistentState state;
	private INavigationService navigationService;

	public FavouritesPresenter(INavigationService navigationService, PropertyFinderPersistentState state) {
		this.state = state;
		this.navigationService = navigationService;
	}

	public void setView(View view) {
		view.setFavourites(state.getFavourites());
		view.propertySelected(new Callback<PropertySelectedEvent>() {
			
			public void complete(PropertySelectedEvent event) {
				PropertyPresenter presenter = 
						new PropertyPresenter(state,((PropertyEventArgs) event.getArguments()).getProperty());
				navigationService.pushPresenter(presenter);
			};
		});
	}
}
