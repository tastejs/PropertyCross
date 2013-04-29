package com.propertycross.android.events;

import java.util.EventObject;

public abstract class Event<T> extends EventObject {
  private static final long serialVersionUID = -1286841489391024887L;
  private T _args;

  public Event(Object source, T args) {
    super(source);
    this._args = args;
  }

  public T getArguments() {
    return this._args;
  }
}
