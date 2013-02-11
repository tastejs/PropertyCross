package com.propertycross.mgwt.environment;

import com.googlecode.mgwt.ui.client.MGWT;
import com.googlecode.mgwt.ui.client.OsDetection;
import com.propertycross.mgwt.properties.PropertiesManager;

public final class EnvironmentLookup {

    private final PropertiesManager favourites;

    public EnvironmentLookup(PropertiesManager favourites)
    {
        this.favourites = favourites;
    }

    public Environment detect()
    {
        OsDetection os = MGWT.getOsDetection();
        if(os.isDesktop()) return new Desktop(favourites);
        return new Default(favourites);
    }

}
