package com.propertycross.android.events;

public class PropertyEvent extends Event<PropertyEventArgs> {
  private static final long serialVersionUID = 2846647306878428239L;

  public PropertyEvent(Object source, PropertyEventArgs args) {
    super(source, args);
  }
}
