package com.propertycross.android.events;

import com.propertycross.android.model.Property;

public class PropertyEventArgs {
  private Property property;

  public PropertyEventArgs(Property property) {
    this.property = property;
  }

  public Property getProperty() {
    return property;
  }
}