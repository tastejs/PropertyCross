package com.propertycross.mgwt;

import com.google.gwt.junit.client.GWTTestCase;

public abstract class MgwtTestCase extends GWTTestCase {

    @Override
    public final String getModuleName()
    {
        return "com.propertycross.mgwt.mgwttest";
    }

}
