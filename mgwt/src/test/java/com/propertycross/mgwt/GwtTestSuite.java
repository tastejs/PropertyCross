package com.propertycross.mgwt;

import com.google.gwt.junit.tools.GWTTestSuite;
import junit.framework.Test;
import com.propertycross.mgwt.nestoria.gwt.ResponseHandlerGwtTest;
import com.propertycross.mgwt.ui.LocationListGwtTest;
import com.propertycross.mgwt.ui.RecentSearchesListGwtTest;
import junit.framework.TestCase;

public class GwtTestSuite extends TestCase {

    public static Test suite()
    {
        GWTTestSuite suite = new GWTTestSuite("All Tests");
        suite.addTestSuite(LocationListGwtTest.class);
        suite.addTestSuite(RecentSearchesListGwtTest.class);
        suite.addTestSuite(com.propertycross.mgwt.locations.MgwtStorageGwtTest.class);
        suite.addTestSuite(ResponseHandlerGwtTest.class);
        suite.addTestSuite(com.propertycross.mgwt.properties.MgwtStorageGwtTest.class);
        return suite;
    }

}
