package com.propertycross.mgwt.activity;

import com.google.gwt.user.client.ui.IsWidget;

/**
 * Extended by view interfaces that must inform the presenter of user interactions. The presenter supplies an event
 * handler, which may be composed of multiple methods. This results in a single reference from view to presenter, making
 * it easier to track references.
 * 
 * @param <T>
 */
public interface AbstractView<T> extends IsWidget {

  /**
   * Invoked by the presenter to supply a handler to view methods.
   * 
   * @param eventHandler the eventHandler
   */
  void setEventHandler(T eventHandler);
}
