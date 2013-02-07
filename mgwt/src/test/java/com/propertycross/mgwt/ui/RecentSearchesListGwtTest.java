package com.propertycross.mgwt.ui;

import java.util.ArrayList;
import java.util.List;
import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.ui.HasValue;
import com.google.gwt.user.client.ui.Label;
import com.googlecode.mgwt.ui.client.widget.CellList;
import com.googlecode.mgwt.ui.client.widget.celllist.CellSelectedEvent;
import com.propertycross.mgwt.MgwtTestCase;
import com.propertycross.mgwt.locations.Search;
import com.propertycross.mgwt.locations.SearchesManager;

public class RecentSearchesListGwtTest extends MgwtTestCase {

    private HasValue<String> searchBox;
    private MockHasWidgets panel = new MockHasWidgets();
    private RecentSearchesList list;
    private Mocks mocks;

    @Override
    protected void gwtSetUp() throws Exception
    {
        mocks = GWT.create(Mocks.class);

        searchBox = mocks.hasStringValue();

        List<Search> results = new ArrayList<Search>(2);
        results.add(new Search("A", 2));
        results.add(new Search("B", 7));

        list = new RecentSearchesList(mockSearchesManager(results), searchBox);
    }

    private SearchesManager mockSearchesManager(List<Search> results)
    {
        Mocks managerCtx = GWT.create(Mocks.class);
        SearchesManager searches = managerCtx.searchesManager();
        managerCtx.expect(searches.recentSearches()).andReturn(results);
        managerCtx.replay();
        return searches;
    }

    @SuppressWarnings("unchecked")
    public void testCellList() throws Throwable
    {
        searchBox.setValue("A", true);
        mocks.expectLastCall();

        mocks.replay();

        list.addTo(panel);

        assertTrue("widget type", panel.widgets.get(1) instanceof CellList);

        CellList<Search> cl = (CellList<Search>)panel.widgets.get(1);

        cl.fireEvent(new CellSelectedEvent(1, null));
    }

    public void testLabel() throws Throwable
    {
        list.addTo(panel);

        assertTrue("widget type", panel.widgets.get(0) instanceof Label);

        Label l = (Label)panel.widgets.get(0);

        assertEquals("text", "Recent searches:", l.getText());
        assertTrue("word wrap", l.getWordWrap());
    }

    public void testAddsComponents() throws Throwable
    {
        list.addTo(panel);

        assertEquals(2, panel.widgets.size());
    }

    public void testNoAddLabelIfNoSearches() throws Throwable
    {
        list = new RecentSearchesList(
                mockSearchesManager(new ArrayList<Search>(0)), searchBox);

        list.addTo(panel);

        assertTrue(panel.widgets.isEmpty());
    }

}
