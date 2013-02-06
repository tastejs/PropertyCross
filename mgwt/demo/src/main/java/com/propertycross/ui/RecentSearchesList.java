package com.propertycross.ui;

import java.util.Collections;
import java.util.List;
import com.google.gwt.core.client.GWT;
import com.google.gwt.safehtml.client.SafeHtmlTemplates;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlBuilder;
import com.google.gwt.user.client.ui.HasValue;
import com.google.gwt.user.client.ui.HasWidgets;
import com.google.gwt.user.client.ui.Label;
import com.googlecode.mgwt.ui.client.widget.CellList;
import com.googlecode.mgwt.ui.client.widget.celllist.Cell;
import com.googlecode.mgwt.ui.client.widget.celllist.CellSelectedEvent;
import com.googlecode.mgwt.ui.client.widget.celllist.CellSelectedHandler;
import com.propertycross.locations.Search;
import com.propertycross.locations.SearchesManager;
import com.propertycross.navigation.Navigable;


final class RecentSearchesList implements Navigable {

    private final CellList<Search> cl;

    public RecentSearchesList(final SearchesManager manager,
            final HasValue<String> searchBox)
    {
        final List<Search> list = manager.recentSearches();

        cl = !list.isEmpty() ? cellList(list, searchBox) : null;
    }

    private CellList<Search> cellList(final List<Search> list,
            final HasValue<String> searchBox)
    {
        Collections.reverse(list);

        CellList<Search> cl = new CellList<Search>(new LocationCell());
        cl.addCellSelectedHandler(new CellSelectedHandler() {

            @Override public void onCellSelected(CellSelectedEvent e)
            {
                Search l = list.get(e.getIndex());
                searchBox.setValue(l.location(), true);
            }

        });
        cl.render(list);
        return cl;
    }

    @Override
    public void addTo(HasWidgets panel)
    {
        if(cl == null) return;

        panel.add(new Label("Recent searches:"));
        panel.add(cl);
    }

    public final static class LocationCell implements Cell<Search> {

        private static final Template TEMPLATE = GWT.create(Template.class);
        public interface Template extends SafeHtmlTemplates {

            @SafeHtmlTemplates.Template("<div style='width: 100%'>"
                + "<span style='display: inline-block; width: 50%'>{0}</span>"
        		+ "<span style='display: inline-block; width: 50%;" +
        		        " text-align: right'>{1}</span>" +
        		"</div>"
            )
            SafeHtml content(String location, int hits);

        }

        @Override
        public void render(SafeHtmlBuilder b, Search l)
        {
            b.append(TEMPLATE.content(l.location(), l.numberProperties()));
        }

        @Override
        public boolean canBeSelected(Search l)
        {
            return true;
        }

    }

}
