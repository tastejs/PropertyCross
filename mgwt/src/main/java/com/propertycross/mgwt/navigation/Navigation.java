package com.propertycross.mgwt.navigation;

public interface Navigation {

    void goTo(Navigable n);
    boolean hasHistory();
    void goBack();

}
