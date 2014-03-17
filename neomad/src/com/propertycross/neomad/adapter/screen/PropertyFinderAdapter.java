package com.propertycross.neomad.adapter.screen;

import com.neomades.app.ResManager;
import com.neomades.app.ResourceNotFoundException;
import com.neomades.graphics.Color;
import com.neomades.location.Location;
import com.neomades.location.LocationListener;
import com.neomades.location.LocationManager;
import com.neomades.ui.ListView;
import com.neomades.ui.TextField;
import com.neomades.ui.TextLabel;
import com.neomades.ui.VerticalLayout;
import com.neomades.ui.View;
import com.neomades.ui.listeners.ItemClickedListener;
import com.propertycross.neomad.Constants;
import com.propertycross.neomad.Res;
import com.propertycross.neomad.adapter.RecentSearchListAdapter;
import com.propertycross.neomad.event.CallbackEvent;
import com.propertycross.neomad.event.Event;
import com.propertycross.neomad.event.SearchEvent;
import com.propertycross.neomad.model.PersistenceState;
import com.propertycross.neomad.model.PropertyList;
import com.propertycross.neomad.model.search.RecentSearch;
import com.propertycross.neomad.model.search.Search;
import com.propertycross.neomad.service.impl.PersistenceService;
import com.propertycross.neomad.utils.Fonts;

/**
 * @author Neomades
 */
public abstract class PropertyFinderAdapter extends ScreenAdapter implements ItemClickedListener, LocationListener {

	public static final String SERVICE_NAME = "PropertyFinder";

	private ListView list;
	private Search search;
	private RecentSearchListAdapter adapter;
	private PersistenceState state;
	private PropertyList properties;
	private TextField query;

	protected void setContent(int layoutResId) throws ResourceNotFoundException {
		super.setContent(layoutResId);
		replaceListView();
	}

	private void replaceListView() {
		if (Constants.FINDER_LIST_WITH_TABLE_STYLE) {
			VerticalLayout container = ((VerticalLayout)findView(Res.id.ID_PROPERTY_FINDER));
			ListView oldlist = (ListView) findView(Res.id.RECENT_LIST);
			
			ListView styledList = new ListView(ListView.STYLE_GROUPED);
			styledList.setId(Res.id.RECENT_LIST);
			styledList.setBackgroundColor(Color.WHITE);
			styledList.setSeparatorVisible(true);
			styledList.setSeparatorColor(Color.GRAY);
			styledList.setListIndicatorVisible(true);
			styledList.setMarginBottom(Constants.FINDER_LIST_MARGIN);
			styledList.setStretchMode(MATCH_PARENT, MATCH_CONTENT);
			
			container.removeView(oldlist);
			container.addView(styledList);
		}
	}

	protected void setContent(View content) {
		super.setContent(content);
		replaceListView();
	}

	protected TextField getQuery() {
		return query;
	}

	protected Search getSearch() {
		return search;
	}

	protected RecentSearchListAdapter getAdapter() {
		return adapter;
	}

	protected PersistenceState getState() {
		return state;
	}

	protected PropertyList getProperties() {
		return properties;
	}

	protected void setSearch(Search search) {
		this.search = search;
	}

	protected void setState(PersistenceState state) {
		this.state = state;
	}

	protected void setProperties(PropertyList properties) {
		this.properties = properties;
	}

	protected void setQuery(TextField query) {
		this.query = query;
	}

	public String getName() {
		return SERVICE_NAME;
	}

	public void init() {
		super.init();
		((TextLabel) findView(Res.id.RESULTS_HEADER)).setFont(Fonts.DEFAULT_PLAIN_XSMALL);
		query = (TextField) findView(Res.id.ID_SEARCH);
		list = (ListView) findView(Res.id.RECENT_LIST);
		list.setItemClickedListener(this);
		adapter = new RecentSearchListAdapter();
		list.setListAdapter(adapter);
		send(new CallbackEvent(getName(), PersistenceService.SERVICE_NAME, Event.Type.LOAD) {
			public void onComplete(Object result) {
				state = (PersistenceState) result;
				updateSearches();
			}
		});
	}

	protected void update() {
		list.notifyDataChanged();
	}

	protected void updateSearches() {
		((TextLabel) findView(Res.id.RESULTS_HEADER)).setText(Res.string.RECENT_SEARCHES);
		adapter.setItems(state.getSearches());
		update();
	}

	public void onEventReceived(Event e) {
		if (e instanceof CallbackEvent && e.getType() == Event.Type.LOAD_PROPERTIES) {
			((CallbackEvent) e).onComplete(properties);
		}
	}

	public void onItemClicked(int i, View view) {
		RecentSearch recentSearch = (RecentSearch) adapter.getViewModel(i);
		query.setText(recentSearch.getSearch().getLabel());
		setMessage("");
		search = recentSearch.getSearch();
		
		// query
		send(new SearchEvent(getName(), search.getQuery(), 1));
	}

	public void onLocationChanged(final Location location) {
		controller.runOnUiThread(new Runnable() {
			public void run() {
				if (location != null) {
					send(new SearchEvent(getName(), location.getLatitude(), location.getLongitude(), 1));
				} else {
					setMessage(ResManager.getString(Res.string.NO_LOCATION));
				}
			}
		});
	}

	protected void find() {
		LocationManager.getDefault().requestMyLocation(this);
	}

	protected void setMessage(String msg) {
		((TextLabel) findView(Res.id.ERROR_MESSAGE)).setText(msg);
	}
	
	
}
