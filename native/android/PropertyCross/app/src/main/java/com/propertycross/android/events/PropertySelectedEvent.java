package com.propertycross.android.events;

public class PropertySelectedEvent extends Event<PropertyEventArgs> {
  private static final long serialVersionUID = 7580053748824737630L;

  public PropertySelectedEvent(Object source, PropertyEventArgs args) {
    super(source, args);
  }
}