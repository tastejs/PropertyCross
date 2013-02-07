package com.propertycross.mgwt.navigation;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import static org.mockito.Mockito.*;
import static org.junit.Assert.*;

@RunWith(MockitoJUnitRunner.class)
public class NavigationManagerTest {

    @Mock private Navigator forward;
    @Mock private Navigator back;
    private NavigationManager nav;
    @Mock private Navigable n0;
    @Mock private Navigable n1;
    @Mock private Navigable n2;

    @Before
    public void nav() throws Throwable
    {
        nav = new NavigationManager(forward, back);
    }

    @Test
    public void hasHistoryCorrect() throws Throwable
    {
        assertFalse("no page", nav.hasHistory());

        nav.goTo(n0);

        assertFalse("on first page", nav.hasHistory());

        nav.goTo(n1);

        assertTrue("on second page", nav.hasHistory());

        nav.goBack();

        assertFalse("back on first page", nav.hasHistory());
    }

    @Test
    public void backTraversesInReverseOrder() throws Throwable
    {
        nav.goTo(n0);
        verify(forward).goTo(n0);

        nav.goTo(n1);
        verify(forward).goTo(n1);

        nav.goTo(n2);
        verify(forward).goTo(n2);

        nav.goBack();
        verify(back).goTo(n1);

        nav.goBack();
        verify(back).goTo(n0);
    }

    @Test
    public void backWhenNoHistoryIsNoOp() throws Throwable
    {
        nav.goBack();

        verifyZeroInteractions(forward, back);
    }

}