package com.propertycross.navigation;

public interface Navigation {

    void goTo(Navigable n);
    boolean hasHistory();
    void goBack();

}
