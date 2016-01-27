package com.propertycross.neomad.screen;

import java.util.Vector;

import com.neomades.app.Application;
import com.neomades.app.ResManager;
import com.neomades.app.ScreenParams;
import com.neomades.content.ContentError;
import com.neomades.event.Event;
import com.neomades.graphics.Color;
import com.neomades.location.LocationListener;
import com.neomades.location.LocationManager;
import com.neomades.ui.Button;
import com.neomades.ui.ListView;
import com.neomades.ui.TextField;
import com.neomades.ui.TextLabel;
import com.neomades.ui.VerticalLayout;
import com.neomades.ui.View;
import com.neomades.ui.WaitView;
import com.neomades.ui.listeners.ClickListener;
import com.neomades.ui.listeners.ItemClickedListener;
import com.neomades.ui.menu.Menu;
import com.neomades.ui.menu.MenuItem;
import com.propertycross.neomad.Constants;
import com.propertycross.neomad.Res;
import com.propertycross.neomad.model.Location;
import com.propertycross.neomad.model.LocationList;
import com.propertycross.neomad.model.PersistenceState;
import com.propertycross.neomad.model.PropertyList;
import com.propertycross.neomad.model.SearchResult;
import com.propertycross.neomad.model.search.LocationSearch;
import com.propertycross.neomad.model.search.RecentSearch;
import com.propertycross.neomad.model.search.Search;
import com.propertycross.neomad.screen.adapter.list.RecentSearchListAdapter;
import com.propertycross.neomad.screen.adapter.screen.ScreenAdapter;
import com.propertycross.neomad.services.PersistenceStateEvent;
import com.propertycross.neomad.utils.Fonts;

public class PropertyFinder extends ScreenAdapter implements ClickListener, ItemClickedListener, LocationListener {

	public static final String FAVOURITES = "favourites";
	
	private TextField searchQueryTextField;
	private Button doSearch;
	private Button doLocation;
	private WaitView loadingView;

	private ListView recentSearchesList;
	private RecentSearchListAdapter adapter;
	
	private PropertyList properties;
		
	protected void onCreate() {
		// Register events
		this.registerEvent(Constants.EVENT_PROPERTY_LIST);
		this.registerEvent(Constants.LOAD_COMPLETE);
				
		// Set UI
		setContent(Res.layout.PROPERTY_FINDER_SCREEN);
		replaceListView();
		updateTitle(Constants.PROPERTY_FINDER_TITLE);
		setShortTitle(Constants.PROPERTY_FINDER_SHORT_TITLE);
		
		init();
		
		loadingView = (WaitView) findView(Res.id.WAIT_VIEW);
		if (Constants.waitColor != -1) {
			loadingView.setColor(Color.rgb(Constants.waitColor));
			loadingView.setStyle(WaitView.STYLE_GRAY);
		}
		
		// Add listeners
		doSearch = (Button) findView(Res.id.DO_SEARCH);
		doSearch.setClickListener(this);
		
		doLocation = (Button) findView(Res.id.DO_LOCATION);
		doLocation.setClickListener(this);
		if (Constants.IOS) {
			LocationManager.getDefault().requestWhenInUseAuthorization();
		}
	}
	
	protected void init() {
		super.init();
		((TextLabel) findView(Res.id.RESULTS_HEADER))
				.setFont(Fonts.DEFAULT_PLAIN_XSMALL);
		searchQueryTextField = (TextField) findView(Res.id.ID_SEARCH);
		recentSearchesList = (ListView) findView(Res.id.RECENT_LIST);
		recentSearchesList.setItemClickedListener(this);
		adapter = new RecentSearchListAdapter();
		recentSearchesList.setListAdapter(adapter);
		loadRecentSearches();
	}

	protected void onMenuCreate(Menu menu) {
		MenuItem item = null;
		if (Constants.FAVOURITES_WITH_ICON) {
			item = new MenuItem(Res.string.FAVOURITES, Res.image.FAVS_ICON);

		} else if (Constants.FAVOURITES_SHORT_TEXT) {
			item = new MenuItem(Res.string.FAVS);

		} else {
			item = new MenuItem(Res.string.FAVOURITES);
		}
		item.setAsRightAction();
		menu.addItem(item);
	}
	
	protected void onMenuAction(MenuItem item) {
		// only one menu item - load favorites
		ScreenParams values = new ScreenParams();
		values.putObject(FAVOURITES, PersistenceState.getInstance().getFavourites());
		values.putObject(EXTRA_PREVIOUS_SCREEN, getShortTitle());
		controller.pushScreen(PropertyFavourites.class, values);
	}

	private void replaceListView() {
		if (Constants.FINDER_LIST_WITH_TABLE_STYLE) {
			VerticalLayout container = ((VerticalLayout) findView(Res.id.ID_PROPERTY_FINDER));
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
	
	private void loadRecentSearches() {
		Application.getCurrent().getEventBus().send(new PersistenceStateEvent(this, this, Constants.LOAD));
	}
	
	protected void update() {
		recentSearchesList.notifyDataChanged();
	}
	
	protected void updateSearches() {
		updateResultsHeaderTextLabel((TextLabel) findView(Res.id.RESULTS_HEADER), Res.string.RECENT_SEARCHES);
		adapter.setItems(PersistenceState.getInstance().getSearches());
		update();
	}
	
	private void updateResultsHeaderTextLabel(TextLabel textLabel, int textResId) {
		String text = ResManager.getString(textResId);
		if (Constants.RESULTS_HEADER_TITLE_IN_UPPERCASE) {
			text = text.toUpperCase();
		}
		textLabel.setText(text);
	}

	// ItemClickedListener implementation
	public void onItemClicked(int i, View view) {
		RecentSearch recentSearch = (RecentSearch) adapter.getViewModel(i);
		searchQueryTextField.setText(recentSearch.getSearch().getLabel());
		doSearch(recentSearch.getSearch().getQuery());
	}
	
	// ClickListener implementation
	public void onClick(View view) {
		switch (view.getId()) {
		case Res.id.DO_SEARCH:
			doSearch(null);
			break;
		case Res.id.DO_LOCATION:
			doLocation();
			break;
		default:
			// none
			break;
		}
	}

	// LocationListener implementation
	public void onLocationChanged(final com.neomades.location.Location location) {
		controller.runOnUiThread(new Runnable() {
			public void run() {
				if (location != null) {
					LocationSearch eventValue = new LocationSearch(location.getLatitude(), location.getLongitude(), 1);
					send(new Event(eventValue, this, Constants.FIND_BY_LOCATION));
				} else {
					onNoLocation();
				}
			}
		});
	}
	
	protected void setMessage(String msg) {
		((TextLabel) findView(Res.id.ERROR_MESSAGE)).setText(msg);
	}
	
	protected void setActivityIndicatorVisible(boolean on) {
		if (loadingView != null) {
			loadingView.setVisible(on);
		}
		TextLabel label = ((TextLabel) findView(Res.id.ERROR_MESSAGE));
		if (label != null) {
			label.setVisible(!on);
		}
	}
	
	private void enableAction() {
		doSearch.setEnabled(true);
		doLocation.setEnabled(true);
	}
	

	private void doLocation() {
		LocationManager manager = LocationManager.getDefault();
		
		if (!manager.isSupported() || !manager.isLocationEnabledByUser()) {
			onNoLocation();
		}
		else {
			setMessage("");
			setActivityIndicatorVisible(true);
			doLocation.setEnabled(false);
			manager.requestMyLocation(this);
		}
	}
	
	protected void onNoLocation() {
		setActivityIndicatorVisible(false);
		setMessage(ResManager.getString(Res.string.NO_LOCATION));
		enableAction();
	}
	
	protected void onLocationNotFound() {
		setActivityIndicatorVisible(false);
		setMessage(ResManager.getString(Res.string.LOCATION_NOT_FOUND));
		enableAction();
	}

	private void doSearch(String query) {
		if (searchQueryTextField.getText() != null) {
			setActivityIndicatorVisible(true);
			doSearch.setEnabled(false);
			setMessage("");
			if (query == null) {
				query = searchQueryTextField.getText().trim();
			}
			LocationSearch eventValue = new LocationSearch(searchQueryTextField.getText().trim(), query, 1);
			send(new Event(eventValue, this, Constants.FIND_BY_NAME));
		}
	}
	
	
	
	protected void onPause() {
		super.onPause();
		setActivityIndicatorVisible(false);
		this.unregisterEvent(Constants.EVENT_PROPERTY_LIST);
	}
	
	protected void onResume() {
		super.onResume();
		setActivityIndicatorVisible(false);
		this.registerEvent(Constants.EVENT_PROPERTY_LIST);
	}
	
	public void onReceiveEvent(Event event) {
		if (event.hasType(Constants.EVENT_PROPERTY_LIST)) {
			SearchResult result = (SearchResult) event.getValue();
			if (result.isError()) {
				onLocationNotFound();
				setActivityIndicatorVisible(false);
				enableAction();
			}
			else if (result.isAmbiguous()) {
				LocationList list = result.getLocationList();
				Vector items = new Vector();
				for (int i = 0; i < list.getSize(); i++) {
					items.addElement(new RecentSearch(new LocationSearch(list.getLocation(i), 1), 0));
				}
				adapter.setItems(items);
				updateResultsHeaderTextLabel((TextLabel) findView(Res.id.RESULTS_HEADER), Res.string.AMBIGUOUS_LOCATION);
				setActivityIndicatorVisible(false);
				enableAction();
				update();
			}
			else if (result.isSuccess()) {
				LocationList locationList = result.getLocationList();
				LocationSearch search = null;
				if (!locationList.isEmpty()) {
					Location l = locationList.getLocation(0);
					search = new LocationSearch(l, 1);
					searchQueryTextField.setText(search.getLabel());
				}
				
				properties = result.getPropertyList();
				
				if (properties.getCount() > 0) {
					// Save recent searches
					PersistenceState.getInstance().persist(new RecentSearch(search, properties.getCount()));
					
					ScreenParams values = new ScreenParams();
					values.putObject(PropertyList.class.getName(), properties);
					values.putObject(Search.class.getName(), search);
					values.putObject(EXTRA_PREVIOUS_SCREEN, getShortTitle());
					setActivityIndicatorVisible(false);
					enableAction();
					this.unregisterEvent(Constants.EVENT_PROPERTY_LIST);
					controller.pushScreen(PropertyResult.class, values);
				}
				else {
					setMessage(ResManager.getString(Res.string.NO_RESULT));
					setActivityIndicatorVisible(false);
					enableAction();
				}
				updateSearches();
			}
		}
		else if (event.hasType("ContentError") && ((ContentError)event).isNetworkError()) {
			onNetworkError();
		}
		else if (event.hasType(Constants.LOAD_COMPLETE)) {
			updateSearches();
		}
	}

	private void onNetworkError() {
		setMessage(ResManager.getString(Res.string.NETWORK_ERROR));
		enableAction();
	}

}
