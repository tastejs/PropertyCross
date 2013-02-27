package com.propertycross.mgwt.nestoria;

import java.util.List;
import com.propertycross.mgwt.locations.Location;
import com.propertycross.mgwt.nestoria.Response.ListingsFound;
import com.propertycross.mgwt.properties.Property;

public interface RequestSender {

    void ping(String url, Callback c);

    /**
     * 
     * @author ceberhardt
     *
     */
    public static interface Callback {

        void onResultsFound(ListingsFound response);
        
        void onNoLocation(List<Location> suggested);
        
        void onNoLocation();
        
        void onError(Throwable t);
        
        void onTimeout();

    }

}
