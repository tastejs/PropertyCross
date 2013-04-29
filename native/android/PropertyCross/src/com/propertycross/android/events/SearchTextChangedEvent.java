package com.propertycross.android.events;

public class SearchTextChangedEvent extends Event<SearchTextChangedEventArgs> {
  private static final long serialVersionUID = 9029247445019627179L;

  public SearchTextChangedEvent(Object source, SearchTextChangedEventArgs args) {
    super(source, args);
  }
}