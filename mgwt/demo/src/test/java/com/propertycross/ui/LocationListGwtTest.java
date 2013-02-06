package com.propertycross.ui;

import java.util.ArrayList;
import java.util.List;
import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.ui.HasValue;
import com.google.gwt.user.client.ui.Label;
import com.googlecode.mgwt.ui.client.widget.CellList;
import com.googlecode.mgwt.ui.client.widget.celllist.CellSelectedEvent;
import com.propertycross.MgwtTestCase;
import com.propertycross.locations.Location;



public class LocationListGwtTest extends MgwtTestCase {

    private List<Location> results = new ArrayList<Location>();
    private HasValue<String> searchBox;
    private MockHasWidgets panel = new MockHasWidgets();
    private LocationList list;
    private Mocks mocks;

    @Override
    protected void gwtSetUp() throws Exception
    {
        mocks = GWT.create(Mocks.class);

        searchBox = mocks.hasStringValue();

        results.add(new Location("longA", "A"));
        results.add(new Location("longB", "B"));
        
        list = new LocationList(searchBox, results);
    }

    @SuppressWarnings("unchecked")
    public void testCellList() throws Throwable
    {
        list.addTo(panel);

        assertTrue("widget type", panel.widgets.get(1) instanceof CellList);

        CellList<Location> cl = (CellList<Location>)panel.widgets.get(1);

        searchBox.setValue("B", true);
        mocks.expectLastCall();

        mocks.replay();

        cl.fireEvent(new CellSelectedEvent(1, null));
    }

    public void testLabel() throws Throwable
    {
        list.addTo(panel);

        assertTrue("widget type", panel.widgets.get(0) instanceof Label);

        Label l = (Label)panel.widgets.get(0);

        assertEquals("text", "Please select a location below:", l.getText());
        assertTrue("word wrap", l.getWordWrap());
    }

    public void testAddsComponents() throws Throwable
    {
        list.addTo(panel);

        assertEquals(2, panel.widgets.size());
    }

    public void testNoAddLabelIfNoLocations() throws Throwable
    {
        LocationList list = new LocationList(
                searchBox, new ArrayList<Location>());

        list.addTo(panel);

        assertTrue(panel.widgets.isEmpty());
    }

}
