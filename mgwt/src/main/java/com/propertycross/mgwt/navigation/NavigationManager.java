package com.propertycross.mgwt.navigation;

import java.util.Stack;

public final class NavigationManager implements Navigation {

    private final Navigator forward;
    private final Navigator back;
    private final Stack<Navigable> history = new Stack<Navigable>();
    private Navigable current;

    public NavigationManager(Navigator forward, Navigator back)
    {
        this.forward = forward;
        this.back = back;
    }

    @Override
    public void goTo(Navigable n)
    {
        if(current != null) history.add(current);
        current = n;
        forward.goTo(n);
    }

    @Override
    public boolean hasHistory()
    {
        return !history.isEmpty();
    }

    @Override
    public void goBack()
    {
        if(!hasHistory()) return;
        current = history.pop();
        back.goTo(current);
    }

}
