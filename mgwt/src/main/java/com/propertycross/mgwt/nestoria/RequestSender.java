package com.propertycross.mgwt.nestoria;

import java.util.List;
import com.propertycross.mgwt.locations.Location;
import com.propertycross.mgwt.properties.Property;

public interface RequestSender {

    void ping(String url, Callback c);

    public static interface Callback {

        void onResultsFound(List<Property> results, Location location,
                int page, int totalResults);
        void onNoLocation(List<Location> suggested);
        void onNoLocation();
        void onError(Throwable t);
        void onTimeout();

    }

}
