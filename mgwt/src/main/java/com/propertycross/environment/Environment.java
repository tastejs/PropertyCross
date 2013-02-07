package com.propertycross.environment;

import com.propertycross.navigation.Navigation;

public interface Environment {

    String appName();
    Navigation createNavigator();

}
