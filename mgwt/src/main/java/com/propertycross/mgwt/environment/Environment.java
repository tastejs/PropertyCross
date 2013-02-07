package com.propertycross.mgwt.environment;

import com.propertycross.mgwt.navigation.Navigation;

public interface Environment {

    String appName();
    Navigation createNavigator();

}
