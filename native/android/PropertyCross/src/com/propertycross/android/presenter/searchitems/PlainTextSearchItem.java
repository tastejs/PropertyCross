package com.propertycross.android.presenter.searchitems;

import com.propertycross.android.events.Callback;
import com.propertycross.android.model.PropertyDataSource;
import com.propertycross.android.model.PropertyDataSourceResult;

public class PlainTextSearchItem extends SearchItem {
	private String searchText;
	private String displayText;

	public PlainTextSearchItem() {
	}

	public PlainTextSearchItem(String text) {
		this.displayText = text;
		this.searchText = text;
	}

	public PlainTextSearchItem(String searchText, String displayText) {
		this.displayText = displayText;
		this.searchText = searchText;
	}

	public String getDisplayText() {
		return displayText;
	}

	public void setDisplayText(String text) {
		displayText = text;
	}

	public String getSearchText() {
		return searchText;
	}

	public void setSearchText(String text) {
		searchText = text;
	}

	public void findProperties(PropertyDataSource source, int pageNumber,
			Callback<PropertyDataSourceResult> complete, Callback<Exception> error) {
		source.findProperties(searchText, pageNumber, complete, error);
	}
}
