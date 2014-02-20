package com.propertycross.neomad.screen;

import java.util.Vector;

import com.neomades.app.ResManager;
import com.neomades.app.ScreenParams;
import com.neomades.json.JSONException;
import com.neomades.json.JSONObject;
import com.neomades.ui.Button;
import com.neomades.ui.TextLabel;
import com.neomades.ui.View;
import com.neomades.ui.listeners.ClickListener;
import com.neomades.ui.menu.Menu;
import com.neomades.ui.menu.MenuItem;
import com.propertycross.neomad.Constants;
import com.propertycross.neomad.Res;
import com.propertycross.neomad.adapter.screen.PropertyFinderAdapter;
import com.propertycross.neomad.event.CallbackEvent;
import com.propertycross.neomad.event.Event;
import com.propertycross.neomad.event.SearchEvent;
import com.propertycross.neomad.model.Location;
import com.propertycross.neomad.model.LocationList;
import com.propertycross.neomad.model.PersistenceState;
import com.propertycross.neomad.model.PropertyList;
import com.propertycross.neomad.model.search.FullTextSearch;
import com.propertycross.neomad.model.search.GeoLocationSearch;
import com.propertycross.neomad.model.search.RecentSearch;
import com.propertycross.neomad.model.search.Search;
import com.propertycross.neomad.service.impl.PersistenceService;
import com.propertycross.neomad.utils.Log;

/**
 * @author Neomades
 */
public class PropertyFinder extends PropertyFinderAdapter {

	public static final String FAVOURITES = "favourites";
	private Button doSearch;
	private Button doLocation;

	protected void onCreate() {
		setContent(Res.layout.PROPERTY_FINDER_SCREEN);
		updateTitle(Constants.PROPERTY_FINDER_TITLE);
		setShortTitle(Constants.PROPERTY_FINDER_SHORT_TITLE);
		init();
		
		doSearch = (Button) findView(Res.id.DO_SEARCH);
		doLocation = (Button) findView(Res.id.DO_LOCATION);

		doSearch.setClickListener(new ClickListener() {
			public void onClick(View view) {
				if (getQuery().getText() != null) {
					doSearch.setEnabled(false);
					setMessage("");
					send(new SearchEvent(getName(), getQuery().getText().trim(), 1));
				}
			}
		});
		doLocation.setClickListener(new ClickListener() {
			public void onClick(View view) {
				setMessage("");
				doLocation.setEnabled(false);
				find();
			}
		});
	}

	protected void onMenuCreate(Menu menu) {
		MenuItem item = null;
		if (Constants.FAVOURITES_WITH_ICON) {
			item = new MenuItem(Res.string.FAVOURITES, Res.image.FAVS);
			
		} else if (Constants.FAVOURITES_SHORT_TEXT) {
			item = new MenuItem(
					Res.string.FAVS);
			
		} else {
			item = new MenuItem(
					Res.string.FAVOURITES);	
		}
		item.setAsRightAction();
		menu.addItem(item);
	}

	protected void onMenuAction(MenuItem item) {
		send(new CallbackEvent(getName(), PersistenceService.SERVICE_NAME,
				Event.Type.LOAD) {
			public void onComplete(Object result) {
				setState((PersistenceState) result);
				ScreenParams values = new ScreenParams();
				values.putObject(FAVOURITES, getState().getFavourites());
				values.putObject(EXTRA_PREVIOUS_SCREEN, getShortTitle());
				controller.pushScreen(PropertyFavourites.class, values);
			}
		});
	}

	public void handleFindByName(Object data, boolean parseLocation) {
		try {
			JSONObject json = new JSONObject(data.toString());
			if (parseLocation) {
				Vector location = LocationList.valueOf(json).getData();
				if (!location.isEmpty()) {
					Location l = (Location) location.elementAt(0);
					setSearch(new GeoLocationSearch(l));
					getQuery().setText(getSearch().getLabel());
				}
			} else {
				setSearch(new FullTextSearch(getQuery().getText()));
			}
			setProperties(PropertyList.valueOf(json));

			if (getProperties().getCount() > 0) {
				getState().persist(new RecentSearch(getSearch(), getProperties().getCount()));
				ScreenParams values = new ScreenParams();
				values.putObject(PropertyList.class.getName(), getProperties());
				values.putObject(Search.class.getName(), getSearch());
				values.putObject(EXTRA_PREVIOUS_SCREEN, getShortTitle());
				controller.pushScreen(PropertyResult.class, values);
			} else {
				setMessage(ResManager.getString(Res.string.NO_RESULT));
			}
			updateSearches();
		} catch (JSONException ex) {
			Log.d(ex.getMessage());
		}
		enableAction();
	}

	public void handleFindByPlace(Object data) {
		try {
			LocationList l = LocationList.valueOf(new JSONObject(data
					.toString()));
			Vector items = new Vector();
			for (int i = 0; i < l.getData().size(); i++) {
				items.addElement(new RecentSearch(new GeoLocationSearch(
						(Location) l.getData().elementAt(i)), 0));
			}
			getAdapter().setItems(items);
			((TextLabel) findView(Res.id.RESULTS_HEADER))
					.setText(Res.string.AMBIGUOUS_LOCATION);
			update();
		} catch (JSONException ex) {
			Log.d(ex.getMessage());
		}
		enableAction();
	}

	public void receive(Event e) {
		super.receive(e);
		if (e.getType() == Event.Type.FIND_ERROR) {
			setMessage(ResManager.getString(Res.string.LOCATION_NOT_FOUND));
			enableAction();
		}
		else if (e.getType() == Event.Type.FIND_BY_NAME_RES) {
			handleFindByName(e.getValue(), false);
			update();
		}
		else if (e.getType() == Event.Type.FIND_BY_PLACE_RES) {
			handleFindByPlace(e.getValue());
		}
		else if (e.getType() == Event.Type.FIND_BY_LOCATION_RES) {
			handleFindByName(e.getValue(), true);
			update();
		}
		else if (e.getType() == Event.Type.NETWORK_ERROR) {
			setMessage(ResManager.getString(Res.string.NETWORK_ERROR));
			enableAction();
		}
	}

	private void enableAction() {
		doSearch.setEnabled(true);
		doLocation.setEnabled(true);
	}
}
