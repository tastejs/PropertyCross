package com.propertycross.ui;

import java.util.List;
import com.google.gwt.safehtml.shared.SafeHtmlBuilder;
import com.google.gwt.user.client.ui.HasValue;
import com.google.gwt.user.client.ui.HasWidgets;
import com.google.gwt.user.client.ui.Label;
import com.googlecode.mgwt.ui.client.widget.CellList;
import com.googlecode.mgwt.ui.client.widget.celllist.Cell;
import com.googlecode.mgwt.ui.client.widget.celllist.CellSelectedEvent;
import com.googlecode.mgwt.ui.client.widget.celllist.CellSelectedHandler;
import com.propertycross.locations.Location;
import com.propertycross.navigation.Navigable;


final class LocationList implements Navigable {

    private final CellList<Location> cl;

    public LocationList(final HasValue<String> searchBox,
            final List<Location> results)
    {
        cl = !results.isEmpty() ? cellList(searchBox, results) : null;
    }

    private CellList<Location> cellList(final HasValue<String> searchBox,
            final List<Location> results)
    {
        CellList<Location> cl = new CellList<Location>(new LocationCell());
        cl.addCellSelectedHandler(new CellSelectedHandler() {

            @Override public void onCellSelected(CellSelectedEvent e)
            {
                Location l = results.get(e.getIndex());
                searchBox.setValue(l.name(), true);
            }

        });
        cl.render(results);
        return cl;
    }

    @Override
    public void addTo(HasWidgets panel)
    {
        if(cl == null) return;

        panel.add(new Label("Please select a location below:"));
        panel.add(cl);
    }

    private final static class LocationCell implements Cell<Location> {

        @Override
        public void render(SafeHtmlBuilder b, Location l)
        {
            b.appendEscaped(l.longTitle());
        }

        @Override
        public boolean canBeSelected(Location l)
        {
            return true;
        }

    }

}
