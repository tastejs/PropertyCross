package com.propertycross.android.events;

public class SearchTextChangedEventArgs {
  private String text;

  public SearchTextChangedEventArgs(String text) {
    this.text = text;
  }

  public String getText() {
    return text;
  }
}
