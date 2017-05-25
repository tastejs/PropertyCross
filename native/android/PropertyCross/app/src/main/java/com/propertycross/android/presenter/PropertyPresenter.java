package com.propertycross.android.presenter;

import com.propertycross.android.events.Callback;
import com.propertycross.android.events.UIEvent;
import com.propertycross.android.model.Property;

public class PropertyPresenter {

	public interface View {
		void setProperty(Property property);
		void setIsFavourited(boolean isFavourited);
		void toggleFavourite(Callback<UIEvent> callback);
	}

	private Property property;
	private PropertyFinderPersistentState state;
	private View view;

	public PropertyPresenter(PropertyFinderPersistentState state, Property property) {
		this.state = state;
		this.property = property;
	}

	public void setView(View v) {
		view = v;
		view.setProperty(property);
		view.toggleFavourite(new Callback<UIEvent>() {
			
			public void complete(UIEvent event) {
				state.toggleFavourite(property);
				view.setIsFavourited(state.isPropertyFavourited(property));
			}
		});
		view.setIsFavourited(state.isPropertyFavourited(property));
	}
}
