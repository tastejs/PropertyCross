package com.propertycross.android.presenter;

import java.util.List;

import com.propertycross.android.events.Callback;
import com.propertycross.android.events.LocationSelectedEvent;
import com.propertycross.android.events.LocationSelectedEventArgs;
import com.propertycross.android.events.RecentSearchSelectedEvent;
import com.propertycross.android.events.RecentSearchSelectedEventArgs;
import com.propertycross.android.events.SearchTextChangedEvent;
import com.propertycross.android.events.SearchTextChangedEventArgs;
import com.propertycross.android.events.UIEvent;
import com.propertycross.android.model.Location;
import com.propertycross.android.model.PropertyDataSource;
import com.propertycross.android.model.PropertyDataSourceResult;
import com.propertycross.android.model.PropertyListingsResult;
import com.propertycross.android.model.PropertyLocationsResult;
import com.propertycross.android.presenter.searchitems.GeoLocationSearchItem;
import com.propertycross.android.presenter.searchitems.PlainTextSearchItem;
import com.propertycross.android.presenter.searchitems.SearchItem;

public class PropertyFinderPresenter {

	public interface View {
		void setSearchText(String searchText);
		void setMessage(String message);
		void displaySuggestedLocations(List<Location> locations);
		void displayRecentSearches(List<RecentSearch> recentSearches);
		void setIsLoading(boolean isLoading);
		void searchButtonClicked(Callback<UIEvent> callback);
		void searchTextChanged(Callback<SearchTextChangedEvent> callback);
		void myLocationButtonClicked(Callback<UIEvent> callback);
		void favouritesClicked(Callback<UIEvent> callback);
		void locationSelected(Callback<LocationSelectedEvent> callback);
		void recentSearchSelected(Callback<RecentSearchSelectedEvent> callback);
	}

	private View view;
	private PropertyDataSource propertyDataSource;
	private INavigationService navigationService;
	private PropertyFinderPersistentState state;
	private IGeoLocationService geolocationService;
	private SearchItem searchItem = new PlainTextSearchItem();

	public PropertyFinderPresenter(PropertyFinderPersistentState state, PropertyDataSource dataSource,
			INavigationService navigationService, IGeoLocationService geolocationService) {
		this.propertyDataSource = dataSource;
		this.navigationService = navigationService;
		this.state = state;
		this.geolocationService = geolocationService;
	}

	public void setView(View v) {
		view = v;

		view.searchButtonClicked(new Callback<UIEvent>() {
			
			public void complete(UIEvent event) {
				searchForProperties();
			}
		});
		
		view.searchTextChanged(new Callback<SearchTextChangedEvent>() {
			
			public void complete(SearchTextChangedEvent event) {
				SearchTextChangedEventArgs args = (SearchTextChangedEventArgs) event.getArguments();
				if (args.getText() != searchItem.getDisplayText())
					searchItem = new PlainTextSearchItem(args.getText());
			}
		});
		
		view.myLocationButtonClicked(new Callback<UIEvent>() {
			
			public void complete(UIEvent event) {
				view.setIsLoading(true);
				geolocationService.getLocation(new Callback<GeoLocation> () {

					@Override
					public void complete(GeoLocation location) {
						view.setIsLoading(false);
						if (location == null) {
							view.setMessage("Unable to detect current location. Please ensure location is turned on in your phone settings and try again.");
						}
						else {
							searchItem = new GeoLocationSearchItem(location);
							view.setSearchText(searchItem.getDisplayText());
							searchForProperties();
						}
					}
					
				});
			}
		});
		
		view.favouritesClicked(new Callback<UIEvent>() {
			
			public void complete(UIEvent event) {
				FavouritesPresenter presenter = new FavouritesPresenter(navigationService, state);
				navigationService.pushPresenter(presenter);
			}
		});
		
		view.locationSelected(new Callback<LocationSelectedEvent>() {
			
			public void complete(LocationSelectedEvent event) {
				Location location = ((LocationSelectedEventArgs) event.getArguments()).getLocation();
				view.setSearchText(location.getDisplayName());
				view.displaySuggestedLocations(null);
				searchItem = new PlainTextSearchItem(location.getName(),location.getDisplayName());
				PropertyFinderPresenter.this.searchForProperties();
			}
		});
		
		view.recentSearchSelected(new Callback<RecentSearchSelectedEvent>() {
			
			public void complete(RecentSearchSelectedEvent event) {
				RecentSearch search = ((RecentSearchSelectedEventArgs) event.getArguments()).getRecentSearch();
				searchItem = search.getSearch();
				view.setSearchText(searchItem.getDisplayText());
				PropertyFinderPresenter.this.searchForProperties();
			}
		});
		
		view.displayRecentSearches(state.getRecentSearches().size() > 0 ? state.getRecentSearches() : null);
	}

	private void searchForProperties() {
		view.setIsLoading(true);
		searchItem.findProperties(propertyDataSource, 1,
				new Callback<PropertyDataSourceResult>() {

					@Override
					public void complete(PropertyDataSourceResult result) {
						
						if(result instanceof PropertyListingsResult) {
							PropertyListingsResult propertiesResult = (PropertyListingsResult) result;
							
							if(propertiesResult.getData().size() == 0) {
								view.setMessage("There were no properties found for the given location.");
							}
							else {
								state.addSearchToRecent(new RecentSearch(searchItem, propertiesResult.getTotalResult()));
								view.displayRecentSearches(state.getRecentSearches());
								SearchResultsPresenter presenter = 
										new SearchResultsPresenter(navigationService, state, propertiesResult, searchItem, propertyDataSource);
								navigationService.pushPresenter(presenter);
							}
						}
						else if (result instanceof PropertyLocationsResult) {
							view.displayRecentSearches(null);
							view.displaySuggestedLocations(((PropertyLocationsResult) result).getData());
						}
						else {
							view.setMessage("The location given was not recognised");
						}
						
						view.setIsLoading(false);						
					}
			
		},
				new Callback<Exception>() {

					@Override
					public void complete(Exception e) {
						view.setMessage("An error occurred while searching. Please check your network connection and try again.");
						view.setIsLoading(false);
					}
		});		
	}
}
