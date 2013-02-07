package com.propertycross.mgwt.properties;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;
import java.util.ArrayList;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class OrderedPropertiesManagerTest {

    private OrderedPropertiesManager cache;
    @Mock private PropertiesStorage storage;

    @Before
    public void cache() throws Throwable
    {
        List<Property> queue = new ArrayList<Property>();
        queue.add(new Property("0", "t0", "p0", "bd0", "bt0",
                "ty0", "i0", "s0"));
        queue.add(new Property("1", "t1", "p1", "bd1", "bt1",
                "ty1", "i1", "s1"));
        when(storage.favourites()).thenReturn(queue);
        cache = new OrderedPropertiesManager(storage);
    }

    @Test
    public void loadsFromStorage() throws Throwable
    {
        verify(storage).favourites();
    }

    @Test
    public void checksIfFavourite() throws Throwable
    {
        assertTrue("is favourite", cache.isFavourite(new Property(
                "0", "t0", "p0", "bd0", "bt0", "ty0", "i0", "s0")));
        assertFalse("isn't favourite", cache.isFavourite(new Property(
                "X", "t0", "p0", "bd0", "bt0", "ty0", "i0", "s0")));
    }

    @Test
    public void removesFavourite() throws Throwable
    {
        cache.removeFavourite(new Property("0", "t0", "p0", "bd0", "bt0",
                "ty0", "i0", "s0"));

        List<Property> expected = new ArrayList<Property>();
        expected.add(new Property("1", "t1", "p1", "bd1", "bt1",
                "ty1", "i1", "s1"));

        verify(storage).saveFavourites(expected);
    }

    @Test
    public void caseSameSearchMovedToHeadOfTheQueue()
    {
        Property prop0 = new Property("0", "t0", "p0", "bd0", "bt0",
                "ty0", "i0", "s0");

        cache.addFavourite(prop0);

        List<Property> expected = new ArrayList<Property>();
        expected.add(new Property("1", "t1", "p1", "bd1", "bt1",
                "ty1", "i1", "s1"));
        expected.add(prop0);

        verify(storage).saveFavourites(expected);
    }

    @Test
    public void addsNewSearch() throws Throwable
    {
        Property newProp = new Property("2", "t2", "p2", "bd2", "bt2",
                "ty2", "i2", "s2");

        cache.addFavourite(newProp);

        List<Property> expected = new ArrayList<Property>();
        expected.add(new Property("0", "t0", "p0", "bd0", "bt0",
                "ty0", "i0", "s0"));
        expected.add(new Property("1", "t1", "p1", "bd1", "bt1",
                "ty1", "i1", "s1"));
        expected.add(newProp);

        verify(storage).saveFavourites(expected);
    }

}
