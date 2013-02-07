package com.propertycross;

import com.google.gwt.junit.tools.GWTTestSuite;
import junit.framework.Test;
import com.propertycross.nestoria.gwt.ResponseHandlerGwtTest;
import com.propertycross.ui.LocationListGwtTest;
import com.propertycross.ui.RecentSearchesListGwtTest;
import junit.framework.TestCase;


public class GwtTestSuite extends TestCase {

    public static Test suite()
    {
        GWTTestSuite suite = new GWTTestSuite("All Tests");
        suite.addTestSuite(LocationListGwtTest.class);
        suite.addTestSuite(RecentSearchesListGwtTest.class);
        suite.addTestSuite(com.propertycross.locations.MgwtStorageGwtTest.class);
        suite.addTestSuite(ResponseHandlerGwtTest.class);
        suite.addTestSuite(com.propertycross.properties.MgwtStorageGwtTest.class);
        return suite;
    }

}
