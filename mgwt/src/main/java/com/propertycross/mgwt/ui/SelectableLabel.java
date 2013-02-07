package com.propertycross.mgwt.ui;

import com.google.gwt.user.client.ui.Label;

public final class SelectableLabel extends Label {

    public SelectableLabel(String text)
    {
        super(text);
        getElement().getStyle().setProperty("webkitUserSelect", "auto");
    }

}
