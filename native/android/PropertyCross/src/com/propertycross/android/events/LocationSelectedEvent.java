package com.propertycross.android.events;

public class LocationSelectedEvent extends Event<LocationSelectedEventArgs> {
  private static final long serialVersionUID = -4196656191673228852L;

  public LocationSelectedEvent(Object source, LocationSelectedEventArgs args) {
    super(source, args);
  }
}