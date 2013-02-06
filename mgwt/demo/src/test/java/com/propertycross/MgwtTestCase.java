package com.propertycross;

import com.google.gwt.junit.client.GWTTestCase;


public abstract class MgwtTestCase extends GWTTestCase {

    @Override
    public final String getModuleName()
    {
        return "com.propertycross.mgwttest";
    }

}
