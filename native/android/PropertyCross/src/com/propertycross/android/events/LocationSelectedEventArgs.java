package com.propertycross.android.events;

import com.propertycross.android.model.Location;

public class LocationSelectedEventArgs {
  private Location location;

  public LocationSelectedEventArgs(Location location) {
    this.location = location;
  }

  public Location getLocation() {
    return location;
  }
}
