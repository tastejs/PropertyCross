package com.propertycross.neomad.adapter.screen;

import com.propertycross.neomad.event.CallbackEvent;
import com.propertycross.neomad.event.Event;
import com.propertycross.neomad.model.PersistenceState;
import com.propertycross.neomad.model.Property;
import com.propertycross.neomad.service.impl.PersistenceService;

/**
 * @author Neomades
 */
public abstract class PropertyDetailAdapter extends ScreenAdapter {
	public static final String SERVICE_NAME = "PropertyDetail";
	private PersistenceState state;
	static final int d=0x80c0c0c0;
	private Property property;

	public Property getProperty() {
		return property;
	}

	public String getName() {
		return SERVICE_NAME;
	}

	public void init() {
		super.init();
		send(new CallbackEvent(getName(), PersistenceService.SERVICE_NAME,
				Event.Type.LOAD) {
			public void onComplete(Object result) {
				state = (PersistenceState) result;
				update();
			}
		});
		property = (Property) getScreenParams().getObject(
				Property.class.getName());
	}

	protected void update() {
	}

	protected void toggleFavorite() {
		state.persist(property);
	}

	protected boolean isFavorite() {
		return state.isFavorite(property);
	}

	public void receive(Event e) {

	}
}
