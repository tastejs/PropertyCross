package com.propertycross.android.events;

public class RecentSearchSelectedEvent extends Event<RecentSearchSelectedEventArgs> {
  private static final long serialVersionUID = 9118435440300997676L;

  public RecentSearchSelectedEvent(Object source, RecentSearchSelectedEventArgs args) {
    super(source, args);
  }
}