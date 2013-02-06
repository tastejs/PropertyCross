package com.propertycross.ui;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import com.google.gwt.user.client.ui.HasWidgets;
import com.google.gwt.user.client.ui.Widget;


public final class MockHasWidgets implements HasWidgets {
    
    public final List<Widget> widgets = new ArrayList<Widget>();

    @Override
    public void add(Widget w)
    {
        widgets.add(w);
    }

    @Override
    public void clear()
    {
        widgets.clear();
    }

    @Override
    public Iterator<Widget> iterator()
    {
        return widgets.iterator();
    }

    @Override
    public boolean remove(Widget w)
    {
        return widgets.remove(w);
    }

}
