package com.propertycross.neomad.model.search;

/**
 * @author Neomades
 */
public class RecentSearch {

	private Search search;

	private int count;

	public RecentSearch() {
	}

	public RecentSearch(Search searchType, int count) {
		this.search = searchType;
		this.count = count;
	}

	public Search getSearch() {
		return search;
	}

	public void setSearch(Search searchType) {
		this.search = searchType;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}
}
