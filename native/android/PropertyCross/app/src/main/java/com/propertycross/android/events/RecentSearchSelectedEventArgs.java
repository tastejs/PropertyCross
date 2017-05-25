package com.propertycross.android.events;

import com.propertycross.android.presenter.RecentSearch;

public class RecentSearchSelectedEventArgs {
  private RecentSearch recentSearch;

  public RecentSearchSelectedEventArgs(RecentSearch recentSearch) {
    this.recentSearch = recentSearch;
  }

  public RecentSearch getRecentSearch() {
    return recentSearch;
  }
}