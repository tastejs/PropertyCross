package com.propertycross.mgwt.properties;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import com.google.gwt.core.shared.GWT;
import com.googlecode.mgwt.storage.client.Storage;
import com.propertycross.mgwt.PropertyCrossTestCase;
import com.propertycross.mgwt.locations.Search;

public class MgwtStorageGwtTest extends PropertyCrossTestCase {

    private final String json = "[" +
		"{\"id\":\"0\", \"title\":\"t0\", \"price\":\"p0\", " +
		"\"bedrooms\":\"bd0\", \"bathrooms\":\"bt0\", \"type\":\"ty0\", " +
		"\"imgUrl\":\"i0\", \"summary\":\"s0\"}," +
		"{\"id\":\"1\", \"title\":\"t1\", \"price\":\"p1\", " +
        "\"bedrooms\":\"bd1\", \"bathrooms\":\"bt1\", \"type\":\"ty1\", " +
        "\"imgUrl\":\"i1\", \"summary\":\"s1\"}" +
    "]";

    private Storage storage;
    private PropertiesStorage ss;
    private Mocks mocks;
    private List<Property> queue = new ArrayList<Property>();

    @Override
    protected void gwtSetUp() throws Exception
    {
        mocks = GWT.create(Mocks.class);

        storage = mocks.storage();

        ss = new MgwtStorage(storage);

        queue.add(new Property("0", "t0", "p0", "bd0", "bt0",
                "ty0", "i0", "s0"));
        queue.add(new Property("1", "t1", "p1", "bd1", "bt1",
                "ty1", "i1", "s1"));
    }

    public void testSavesFavouritesAsJson() throws Throwable
    {
        storage.setItem("favourites", json);
        mocks.expectLastCall();

        mocks.replay();

        ss.saveFavourites(queue);
    }

    public void testClearsFavourites() throws Throwable
    {
        storage.removeItem("favourites");
        mocks.expectLastCall();

        mocks.replay();

        ss.clearFavourites();
    }

    public void testReturnsEmptyQueueIfNoStoredJson() throws Throwable
    {
        assertEquals(new LinkedList<Search>(), ss.favourites());
    }

    public void testLoadsFavourites() throws Throwable
    {
        mocks.expect(storage.getItem("favourites")).andReturn(json);

        mocks.replay();

        assertEquals(queue, ss.favourites());
    }

}
