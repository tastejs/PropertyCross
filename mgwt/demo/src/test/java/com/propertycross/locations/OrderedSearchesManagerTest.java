package com.propertycross.locations;

import java.util.Collection;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.*;
import static org.mockito.ArgumentCaptor.*;
import static org.mockito.Mockito.*;
import java.util.LinkedList;
import java.util.Queue;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class OrderedSearchesManagerTest {

    private OrderedSearchesManager cache;
    @Mock private SearchesStorage storage;

    @Before
    public void cache() throws Throwable
    {
        cache = new OrderedSearchesManager(storage, 3);
    }

    @Before
    public void storage() throws Throwable
    {
        Queue<Search> queue = new LinkedList<Search>();
        queue.add(new Search("locA", 1));
        queue.add(new Search("locB", 2));
        when(storage.load()).thenReturn(queue);
    }

    @Test
    public void loadsFromStorage() throws Throwable
    {
        verify(storage).load();
    }

    @Test @SuppressWarnings({"rawtypes", "unchecked"})
    public void respectsMaxHistory() throws Throwable
    {
        cache.add("loc", 3);
        cache.add("loc2", 6);

        ArgumentCaptor<Queue> argument = forClass(Queue.class);
        verify(storage, times(2)).save(argument.capture());

        assertThat((Collection<?>)argument.getValue(), hasSize(3));
    }

    @Test
    public void caseInsensitiveSameSearchMovedToHeadOfTheQueue()
    {
        cache.add("loCA", 3);

        Queue<Search> expected = new LinkedList<Search>();
        expected.add(new Search("locB", 2));
        expected.add(new Search("loCA", 3));

        verify(storage).save(expected);
    }

    @Test
    public void addsNewSearch() throws Throwable
    {
        cache.add("loc", 3);

        Queue<Search> expected = new LinkedList<Search>();
        expected.add(new Search("locA", 1));
        expected.add(new Search("locB", 2));
        expected.add(new Search("loc", 3));

        verify(storage).save(expected);
    }

}
