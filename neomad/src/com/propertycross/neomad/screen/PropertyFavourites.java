package com.propertycross.neomad.screen;

import java.util.Vector;

import com.neomades.app.ScreenParams;
import com.neomades.ui.ListView;
import com.neomades.ui.View;
import com.neomades.ui.listeners.ItemClickedListener;
import com.propertycross.neomad.Res;
import com.propertycross.neomad.adapter.PropertyListAdapter;
import com.propertycross.neomad.adapter.screen.ScreenAdapter;
import com.propertycross.neomad.event.CallbackEvent;
import com.propertycross.neomad.event.Event;
import com.propertycross.neomad.model.PersistenceState;
import com.propertycross.neomad.model.Property;
import com.propertycross.neomad.service.impl.PersistenceService;

/**
 * @author Neomades
 */
public class PropertyFavourites extends ScreenAdapter implements ItemClickedListener {

	public static final String FAVOURITES = "favourites";

	public static final String SERVICE_NAME = "PropertyFavourites";

	private ListView list;

	private PropertyListAdapter adapter;

	public String getName() {
		return SERVICE_NAME;
	}

	public void init() {
		super.init();
		list = (ListView) findView(Res.id.PROPERTY_LIST);
		list.setItemClickedListener(this);
		adapter = new PropertyListAdapter(this);
		list.setListAdapter(adapter);
		list.setItemTypeAdapter(adapter);
		Vector items = (Vector) getScreenParams().getObject(FAVOURITES);
		adapter.setModel(items, null, items.size());
		update();
	}

	protected void onCreate() {
		setContent(Res.layout.PROPERTY_SEARCH_SCREEN);
		updateTitle(Res.string.FAVOURITES);
		setShortTitle(Res.string.FAVS);
		init();
	}

	public void onItemClicked(int i, View view) {
		ScreenParams values = new ScreenParams();
		values.putObject(Property.class.getName(), adapter.getViewModel(i));
		values.putObject(EXTRA_PREVIOUS_SCREEN, getShortTitle());
		controller.pushScreen(PropertyDetail.class, values);
	}

	protected void update() {
		list.notifyDataChanged();
	}

	public void receive(Event e) {
		if (e.getType() == Event.Type.UPDATE_LIST) {
			loadListFromPersistence();
		}
	}
	
	private void updateListView(PersistenceState state) {
		Vector items = state.getFavourites();
		adapter.setModel(items, null, items.size());
		update();
	}

	private void loadListFromPersistence() {
		send(new CallbackEvent(getName(), PersistenceService.SERVICE_NAME, Event.Type.LOAD) {
			public void onComplete(Object result) {
				PersistenceState state = (PersistenceState) result;
				updateListView(state);
			}
		});
	}
}
