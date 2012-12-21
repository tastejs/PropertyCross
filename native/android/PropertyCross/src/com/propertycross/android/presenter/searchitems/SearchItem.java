package com.propertycross.android.presenter.searchitems;

import com.propertycross.android.events.Callback;
import com.propertycross.android.model.PropertyDataSource;
import com.propertycross.android.model.PropertyDataSourceResult;

public abstract class SearchItem {
	public abstract String getDisplayText();
	public abstract void setDisplayText(String text);
	public abstract void findProperties(
			PropertyDataSource source, int pageNumber,
			Callback<PropertyDataSourceResult> compete, Callback<Exception> error);
}