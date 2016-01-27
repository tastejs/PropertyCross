package com.propertycross.neomad.screen;

import java.util.Vector;

import com.neomades.app.ScreenParams;
import com.neomades.event.Event;
import com.neomades.ui.ListView;
import com.neomades.ui.TextLabel;
import com.neomades.ui.View;
import com.neomades.ui.listeners.ItemClickedListener;
import com.propertycross.neomad.Constants;
import com.propertycross.neomad.Res;
import com.propertycross.neomad.model.PersistenceState;
import com.propertycross.neomad.model.Property;
import com.propertycross.neomad.screen.adapter.list.PropertyListAdapter;
import com.propertycross.neomad.screen.adapter.screen.ScreenAdapter;

/**
 * @author Neomades
 */
public class PropertyFavourites extends ScreenAdapter implements ItemClickedListener {

	public static final String FAVOURITES = "favourites";

	private ListView list;

	private PropertyListAdapter adapter;
	
	protected void onCreate() {
		setContent(Res.layout.PROPERTY_SEARCH_SCREEN);
		updateTitle(Res.string.FAVOURITES);
		setShortTitle(Res.string.FAVS);
		init();
	}
	
	public void init() {
		super.init();
		
		this.registerEvent(Constants.UPDATE_FAVORITES_COMPLETE);
		
		list = (ListView) findView(Res.id.PROPERTY_LIST);
		list.setItemClickedListener(this);
		
		Vector items = (Vector) getScreenParams().getObject(FAVOURITES);
		
		adapter = new PropertyListAdapter(this);
		adapter.setModel(items, null, items.size());
		list.setListAdapter(adapter);
		list.setItemTypeAdapter(adapter);
		update();
		
		boolean hasNoFavourites = items.size() == 0;
		if (hasNoFavourites) {
			showNoFavsMessage();
		}
		
	}
	
	private void showNoFavsMessage() {
		TextLabel message = (TextLabel)findView(Res.id.LABEL_NO_ITEM);
		message.setText(Res.string.NO_FAVOURITES);
		message.setVisible(true);
		list.setVisible(false);
	}

	public void onItemClicked(int i, View view) {
		ScreenParams values = new ScreenParams();
		values.putObject(Property.class.getName(), adapter.getViewModel(i));
		values.putObject(EXTRA_PREVIOUS_SCREEN, getShortTitle());
		controller.pushScreen(PropertyDetail.class, values);
	}

	protected void update() {
		if (PersistenceState.getInstance().getFavourites().isEmpty()){
			showNoFavsMessage();
		}
		else {
			list.setVisible(true);
			list.notifyDataChanged();
		}
	}

	public void onReceiveEvent(Event event) {
		if (event.hasType(Constants.UPDATE_FAVORITES_COMPLETE)) {
			Vector items = PersistenceState.getInstance().getFavourites();
			adapter.setModel(items, null, items.size());
			update();
		}
	}
}
