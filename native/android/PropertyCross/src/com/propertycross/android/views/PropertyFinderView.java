package com.propertycross.android.views;

import java.util.ArrayList;
import java.util.List;

import com.actionbarsherlock.app.SherlockActivity;
import com.actionbarsherlock.view.Menu;
import com.actionbarsherlock.view.MenuItem;
import com.propertycross.android.R;
import com.propertycross.android.events.Callback;
import com.propertycross.android.events.LocationSelectedEvent;
import com.propertycross.android.events.RecentSearchSelectedEvent;
import com.propertycross.android.events.RecentSearchSelectedEventArgs;
import com.propertycross.android.events.SearchTextChangedEvent;
import com.propertycross.android.events.SearchTextChangedEventArgs;
import com.propertycross.android.events.UIEvent;
import com.propertycross.android.model.JsonWebPropertySearch;
import com.propertycross.android.model.Location;
import com.propertycross.android.model.PropertyDataSource;
import com.propertycross.android.presenter.IGeoLocationService;
import com.propertycross.android.presenter.IMarshalInvokeService;
import com.propertycross.android.presenter.PropertyFinderPersistentState;
import com.propertycross.android.presenter.PropertyFinderPresenter;
import com.propertycross.android.presenter.RecentSearch;
import com.propertycross.android.services.GeoLocationService;
import com.propertycross.android.services.MarshalInvokeService;
import com.propertycross.android.services.NavigationService;
import com.propertycross.android.services.StatePersistenceService;

import android.content.Context;
import android.location.LocationManager;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

public class PropertyFinderView extends SherlockActivity implements PropertyFinderPresenter.View {

	private PropertyFinderPresenter presenter;
	private EditText searchText;
	private Button myLocationButton;
	private Button startSearchButton;
	private TextView messageText;
	private ProgressBar progress;
	private ListView recentSearchList;
	private RecentSearchAdapter adapter;
	private View mainView;
	private Callback<UIEvent> searchButtonClickedCallback;
	private Callback<SearchTextChangedEvent> searchTextChangedCallback;
	private Callback<UIEvent> myLocationClickedCallback;
	private Callback<UIEvent> favouritesClickedCallback;
	private Callback<LocationSelectedEvent> locationSelectedCallback;
	private Callback<RecentSearchSelectedEvent> recentSearchSelectedCallback;
	private GeoLocationService geoLocationService;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		PropertyFinderApplication app = (PropertyFinderApplication) getApplicationContext();
		app.currentActivity = this;
		
		IMarshalInvokeService marshal = new MarshalInvokeService(app);
		PropertyDataSource source = new PropertyDataSource(new JsonWebPropertySearch(marshal));
		geoLocationService = new GeoLocationService((LocationManager) getSystemService(Context.LOCATION_SERVICE), marshal);
		StatePersistenceService stateService = new StatePersistenceService(app);
		PropertyFinderPersistentState state = stateService.loadState();
		
		setContentView(R.layout.property_finder_view);
		
		searchText = (EditText) findViewById(R.id.search);
		searchText.addTextChangedListener(new TextWatcher(){
	        @Override
			public void afterTextChanged(Editable s) {
	        	if (searchTextChangedCallback != null) {
	        		searchTextChangedCallback.complete(
	        				new SearchTextChangedEvent(this, new SearchTextChangedEventArgs(s.toString())));
	        	}
	        }
	        
	        @Override
	        public void beforeTextChanged(CharSequence s, int start, int count, int after){}
	        
	        @Override
	        public void onTextChanged(CharSequence s, int start, int before, int count){}
	    }); 
		
		myLocationButton = (Button) findViewById(R.id.use_location);
		myLocationButton.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				if (myLocationClickedCallback != null) {
					myLocationClickedCallback.complete(new UIEvent(this));
				}				
			}
			
		});
		
		startSearchButton = (Button) findViewById(R.id.do_search);
		startSearchButton.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				if (searchButtonClickedCallback != null) {
					searchButtonClickedCallback.complete(new UIEvent(this));
				}				
			}
			
		});
		
		messageText = (TextView) findViewById(R.id.mainview_message);
		
		recentSearchList = (ListView) findViewById(R.id.recentsearches_list);
		adapter = new RecentSearchAdapter(this, new ArrayList<RecentSearch>());
		recentSearchList.setAdapter(adapter);
		recentSearchList.setOnItemClickListener(new OnItemClickListener() {
			  
			@Override
			  public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
				
				RecentSearch item = adapter.getItem(position);
				
				if (recentSearchSelectedCallback != null) {
					recentSearchSelectedCallback.complete(
							new RecentSearchSelectedEvent(this, new RecentSearchSelectedEventArgs(item)));
				}
			  }
		}); 
		
		progress = (ProgressBar) findViewById(R.id.progress);
		progress.setVisibility(View.INVISIBLE);
		
		mainView = findViewById(R.id.propview);
		
		presenter = new PropertyFinderPresenter(
				state,
				source,
				new NavigationService(app),
				geoLocationService);
		presenter.setView(this);
		app.presenter = presenter;
	}
	
	@Override
	protected void onPause() {
		super.onPause();
		geoLocationService.unsubscribe();
	}
	
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getSupportMenuInflater().inflate(R.menu.favourites_view, menu);
		return true;
	}
	
	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		if (item.getItemId() == R.id.favourites_view_item) {
			if (favouritesClickedCallback != null) {
				favouritesClickedCallback.complete(new UIEvent(this));
				return true;
			}
		}
		
		return super.onOptionsItemSelected(item);
	}

	@Override
	public void setSearchText(String text) {
		searchText.setText(text, TextView.BufferType.EDITABLE);
	}

	@Override
	public void setMessage(String message) {
		messageText.setText(message);
	}

	@Override
	public void displaySuggestedLocations(List<Location> locations) {
	}

	@Override
	public void displayRecentSearches(List<RecentSearch> recentSearches) {
		if(recentSearches != null) {
			adapter = new RecentSearchAdapter(this, recentSearches);
			recentSearchList.setAdapter(adapter);
		}
	}

	@Override
	public void setIsLoading(boolean isLoading) {
		searchText.setEnabled(!isLoading);
		myLocationButton.setEnabled(!isLoading);
		startSearchButton.setEnabled(!isLoading);
		progress.setVisibility(isLoading ? View.VISIBLE : View.INVISIBLE);
		mainView.setVisibility(!isLoading ? View.VISIBLE : View.INVISIBLE);
	}

	@Override
	public void searchButtonClicked(Callback<UIEvent> callback) {
		searchButtonClickedCallback = callback;
	}

	@Override
	public void searchTextChanged(Callback<SearchTextChangedEvent> callback) {
		searchTextChangedCallback = callback;
	}

	@Override
	public void myLocationButtonClicked(Callback<UIEvent> callback) {
		myLocationClickedCallback = callback;
	}

	@Override
	public void favouritesClicked(Callback<UIEvent> callback) {
		favouritesClickedCallback = callback;
	}

	@Override
	public void locationSelected(Callback<LocationSelectedEvent> callback) {
		locationSelectedCallback = callback;
	}

	@Override
	public void recentSearchSelected(Callback<RecentSearchSelectedEvent> callback) {
		recentSearchSelectedCallback = callback;
	}
}