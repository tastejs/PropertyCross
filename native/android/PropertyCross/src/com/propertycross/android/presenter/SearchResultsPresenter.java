package com.propertycross.android.presenter;

import java.util.List;

import com.propertycross.android.events.Callback;
import com.propertycross.android.events.PropertyEventArgs;
import com.propertycross.android.events.PropertySelectedEvent;
import com.propertycross.android.events.UIEvent;
import com.propertycross.android.model.Property;
import com.propertycross.android.model.PropertyDataSource;
import com.propertycross.android.model.PropertyDataSourceResult;
import com.propertycross.android.model.PropertyListingsResult;
import com.propertycross.android.model.PropertyLocationsResult;
import com.propertycross.android.presenter.searchitems.SearchItem;

public class SearchResultsPresenter {

	public interface View {
		void setSearchResults(int totalResult, int pageNumber, int totalPages,
				List<Property> properties, String searchLocation);

		void setLoadMoreVisible(boolean isVisible);

		void setIsLoading(boolean isLoading);

		void loadMoreClicked(Callback<UIEvent> callback);

		void propertySelected(Callback<PropertySelectedEvent> callback);
	}

	private View view;
	private INavigationService navigationService;
	private SearchItem searchItem;
	private int pageNumber = 1;
	private PropertyDataSource dataSource;
	private List<Property> properties;
	private int totalResult;
	private int totalPages;
	private PropertyFinderPersistentState state;

	public SearchResultsPresenter(INavigationService navigationService,
			PropertyFinderPersistentState state,
			PropertyListingsResult results, SearchItem searchItem,
			PropertyDataSource dataSource) {
		this.state = state;
		this.navigationService = navigationService;
		this.searchItem = searchItem;
		this.dataSource = dataSource;
		this.properties = results.getData();
		this.totalResult = results.getTotalResult();
		this.totalPages = results.getTotalPages();
	}

	public void setView(View v) {
		view = v;
		view.loadMoreClicked(new Callback<UIEvent>() {

			public void complete(UIEvent event) {
				pageNumber++;
				view.setIsLoading(true);
				searchItem.findProperties(dataSource, pageNumber,
						new Callback<PropertyDataSourceResult>() {

							@Override
							public void complete(PropertyDataSourceResult result) {
								
								if (result instanceof PropertyListingsResult)
						        {
						          properties.addAll(((PropertyListingsResult)result).getData());
						          view.setSearchResults(totalResult, pageNumber, totalPages, properties, searchItem.getDisplayText());
						          view.setLoadMoreVisible(pageNumber < totalPages);
						          view.setIsLoading(false);
						        }
							}

						}, new Callback<Exception>() {

							@Override
							public void complete(Exception e) {
								view.setIsLoading(false);
							}
						});
			}
		});

		view.propertySelected(new Callback<PropertySelectedEvent>() {

			public void complete(PropertySelectedEvent event) {
				PropertyPresenter presenter = new PropertyPresenter(state,
						((PropertyEventArgs) event.getArguments())
								.getProperty());
				navigationService.pushPresenter(presenter);
			}
		});

		view.setSearchResults(totalResult, pageNumber, totalPages, properties,
				searchItem.getDisplayText());
		view.setLoadMoreVisible(pageNumber < totalPages);
	}
}
