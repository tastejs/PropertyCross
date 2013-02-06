package com.propertycross.locations;

import java.util.LinkedList;
import java.util.Queue;
import com.google.gwt.core.client.GWT;
import com.googlecode.mgwt.storage.client.Storage;
import com.propertycross.MgwtTestCase;


public class MgwtStorageGwtTest extends MgwtTestCase {

    private final String json = "[" +
		"{\"location\":\"locA\", \"hits\":2}," +
        "{\"location\":\"locB\", \"hits\":7}" +
    "]";

    private Storage storage;
    private SearchesStorage ss;
    private Queue<Search> queue = new LinkedList<Search>();
    private Mocks mocks;

    @Override
    protected void gwtSetUp() throws Exception
    {
        mocks = GWT.create(Mocks.class);

        storage = mocks.storage();

        ss = new MgwtStorage(storage);

        queue.add(new Search("locA", 2));
        queue.add(new Search("locB", 7));
    }

    public void testSavesDataAsJson() throws Throwable
    {
        storage.setItem("recentSearches", json);
        mocks.expectLastCall();

        mocks.replay();

        ss.save(queue);
    }

    public void testClear() throws Throwable
    {
        storage.removeItem("recentSearches");
        mocks.expectLastCall();

        mocks.replay();

        ss.clear();
    }

    public void testReturnsEmptyQueueIfNoStoredJson() throws Throwable
    {
        assertEquals(new LinkedList<Search>(), ss.load());
    }

    public void testLoadsSavedData() throws Throwable
    {
        mocks.expect(storage.getItem("recentSearches")).andReturn(json);

        mocks.replay();

        assertEquals(queue, ss.load());
    }

}
