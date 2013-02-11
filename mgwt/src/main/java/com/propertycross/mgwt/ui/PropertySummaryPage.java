package com.propertycross.mgwt.ui;

import java.util.ArrayList;
import java.util.List;
import com.google.gwt.core.client.GWT;
import com.google.gwt.safehtml.client.SafeHtmlTemplates;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlBuilder;
import com.google.gwt.safehtml.shared.SafeUri;

import static com.google.gwt.safehtml.shared.UriUtils.*;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.HasWidgets;
import com.propertycross.mgwt.locations.Location;
import com.propertycross.mgwt.navigation.Navigable;
import com.propertycross.mgwt.navigation.Navigation;
import com.propertycross.mgwt.nestoria.QueryBuilder;
import com.propertycross.mgwt.nestoria.RequestSender.Callback;
import com.propertycross.mgwt.properties.PropertiesManager;
import com.propertycross.mgwt.properties.Property;
import com.propertycross.mgwt.ui.ScrollableCellList.ClickableCell;

public final class PropertySummaryPage implements Navigable {

    private static final Template TEMPLATE = GWT.create(Template.class);
    public interface Template extends SafeHtmlTemplates {

        @SafeHtmlTemplates.Template("<img src=\"{0}\" />" +
            "<span><div>{1}</div><div>{2}</div></span>"
        )
        SafeHtml content(SafeUri imgUrl, String price, String summary);

    }

    private final List<Property> properties;
    private final Navigation nav;
    private final QueryBuilder query;
    private final ScrollableCellList cl = new ScrollableCellList();
    private int page = 1;
    private final PropertiesManager favourites;

    public PropertySummaryPage(Navigation nav, QueryBuilder query,
            PropertiesManager favourites, List<Property> initialProperties,
            Location location, int totalResults)
    {
        this.query = query;
        this.nav = nav;
        this.favourites = favourites;
        properties = new ArrayList<Property>(initialProperties);
        cl.render(generateCells(location, totalResults));
    }

    private List<ClickableCell> generateCells(Location location,
            int totalResults)
    {
        List<ClickableCell> cells =
                new ArrayList<ClickableCell>(properties.size());
        for(Property p : properties) {
            cells.add(new PropCell(p, nav, favourites));
        }
        if(properties.size() < totalResults) {
            cells.add(new MoreCell(location, cells.size(), totalResults));
        }
        return cells;
    }

    @Override
    public void addTo(HasWidgets panel)
    {
        cl.addTo(panel);
    }

    public static final class PropCell implements ClickableCell {

        private final Property p;
        private final Navigation nav;
        private final PropertiesManager favourites;

        public PropCell(Property p, Navigation nav,
                PropertiesManager favourites)
        {
            this.p = p;
            this.nav = nav;
            this.favourites = favourites;
        }

        @Override
        public void appendTo(SafeHtmlBuilder b)
        {
            b.append(TEMPLATE.content(p.imgUrl(),
                    p.formattedPrice(), p.summary()));
        }

        @Override
        public void onClick()
        {
            nav.goTo(new PropertyDetailPanel(favourites, p));
        }

    }

    private final class MoreCell implements ClickableCell {

        private final String subtext;

        public MoreCell(Location location, int numberResults, int totalResults)
        {
            this.subtext = "Results for " + location.longTitle() + ", showing "
                    + numberResults + " of " + totalResults + " properties";
        }

        @Override
        public void appendTo(SafeHtmlBuilder b)
        {
            b.append(TEMPLATE.content(fromString("/pull-icon.png"),
                    "Tap to load more...", subtext));
        }

        @Override
        public void onClick()
        {
            ++page;
            query.setPage(page);
            query.doQuery(new QueryCallback());
        }

    }

    private final class QueryCallback implements Callback {

        @Override public void onTimeout()
        {
            Window.alert("req timeout");
        }

        @Override public void onResultsFound(List<Property> results,
                Location location, int page, int totalResults)
        {
            properties.addAll(results);
            cl.render(generateCells(location, totalResults));
        }

        @Override public void onNoLocation(List<Location> suggested)
        {
        }

        @Override public void onNoLocation()
        {
        }

        @Override public void onError(Throwable t)
        {
            Window.alert(t.getMessage());
        }

    };

}
