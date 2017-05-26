package com.propertycross.android.presenter;

import com.propertycross.android.presenter.searchitems.SearchItem;

public class RecentSearch {
	private SearchItem search;
	private int resultsCount;

	public RecentSearch() {
	}

	public RecentSearch(SearchItem searchItem, int resultsCount) {
		this.search = searchItem;
		this.resultsCount = resultsCount;
	}

	public SearchItem getSearch() {
		return search;
	}

	public void setSearch(SearchItem search) {
		this.search = search;
	}

	public int getResultsCount() {
		return resultsCount;
	}

	public void setResultsCount(int count) {
		resultsCount = count;
	}
}
