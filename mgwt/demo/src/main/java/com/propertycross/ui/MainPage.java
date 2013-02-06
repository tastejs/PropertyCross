package com.propertycross.ui;

import java.util.Collections;
import java.util.List;
import com.google.gwt.core.client.Callback;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.geolocation.client.Geolocation;
import com.google.gwt.geolocation.client.Position;
import com.google.gwt.geolocation.client.Position.Coordinates;
import com.google.gwt.geolocation.client.PositionError;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HasWidgets;
import com.google.gwt.user.client.ui.Label;
import com.googlecode.mgwt.dom.client.event.tap.TapEvent;
import com.googlecode.mgwt.dom.client.event.tap.TapHandler;
import com.googlecode.mgwt.ui.client.widget.Button;
import com.googlecode.mgwt.ui.client.widget.MSearchBox;
import com.propertycross.locations.Location;
import com.propertycross.locations.SearchesManager;
import com.propertycross.navigation.Navigable;
import com.propertycross.navigation.Navigation;
import com.propertycross.nestoria.QueryBuilder;
import com.propertycross.nestoria.RequestSender;
import com.propertycross.properties.PropertiesManager;
import com.propertycross.properties.Property;

public final class MainPage implements Navigable {

    private final Navigation nav;
    private final SearchesManager recentSearches;
    private final RequestSender requestSender;
    private final PropertiesManager favourites;
    private final MSearchBox searchBox;
    private final Button locationBtn;
    private final RecentSearchesList recentSearchesList;
    private final LocationList locationList;

    public MainPage(Navigation nav, RequestSender requestSender,
            SearchesManager recentSearches, PropertiesManager favourites)
    {
        this(nav, requestSender, recentSearches, favourites,
                Collections.<Location>emptyList());
    }

    public MainPage(Navigation nav, RequestSender requestSender,
            SearchesManager recentSearches, PropertiesManager favourites,
            List<Location> locations)
    {
        this.nav = nav;
        this.requestSender = requestSender;
        this.recentSearches = recentSearches;
        this.favourites = favourites;

        searchBox = searchBox();
        locationBtn = Geolocation.isSupported() ? locationBtn() : null;
        recentSearchesList = new RecentSearchesList(recentSearches, searchBox);
        locationList = !locations.isEmpty() ?
                new LocationList(searchBox, locations) : null;
    }

    @Override
    public void addTo(HasWidgets panel)
    {
        panel.add(new HTML("<br />"));
        panel.add(new Label("Use the form below to search for houses "
                + "to buy. You can search by place-name, postcode, or click "
                + "'My location', to search in your current location"));

        panel.add(searchBox);

        if(locationBtn != null) panel.add(locationBtn);

        panel.add(new HTML("<br />"));
        recentSearchesList.addTo(panel);

        if(locationList != null) locationList.addTo(panel);
    }

    private Button locationBtn()
    {
        Button b = new Button("My Location");
        b.addTapHandler(new TapHandler() {

            @Override public void onTap(TapEvent event)
            {
                Geolocation g = Geolocation.getIfSupported();
                g.getCurrentPosition(new Callback<Position, PositionError>() {

                    @Override public void onSuccess(final Position result)
                    {
                        QueryBuilder q = new QueryBuilder(requestSender);
                        Coordinates c = result.getCoordinates();
                        q.setCentrePoint(c.getLatitude(), c.getLongitude());
                        q.doQuery(new QueryCallback(q));
                    }

                    @Override public void onFailure(PositionError ex)
                    {
                        Window.alert("failed to retrieve location: " + ex);
                    }

                });
            }

        });
        return b;
    }

    private MSearchBox searchBox()
    {
        MSearchBox box = new MSearchBox();
        box.addValueChangeHandler(new ValueChangeHandler<String>() {

            @Override public void onValueChange(ValueChangeEvent<String> e)
            {
                QueryBuilder q = new QueryBuilder(requestSender);
                q.setPlaceName(e.getValue());
                q.doQuery(new QueryCallback(q));
            }

        });
        return box;
    }

    private final class QueryCallback implements RequestSender.Callback {

        private final QueryBuilder query;

        public QueryCallback(QueryBuilder query)
        {
            this.query = query;
        }

        @Override public void onTimeout()
        {
            Window.alert("req timeout");
        }

        @Override public void onResultsFound(List<Property> results,
                Location location, int page, int totalResults)
        {
            recentSearches.add(location.name(), totalResults);
            nav.goTo(new PropertySummaryPage(nav, query, favourites, results,
                    location, totalResults));
        }

        @Override public void onNoLocation(List<Location> suggested)
        {
            nav.goTo(new MainPage(nav, requestSender, recentSearches,
                    favourites, suggested));
        }

        @Override public void onNoLocation()
        {
            Window.alert("no location");
        }

        @Override public void onError(Throwable t)
        {
            Window.alert(t.getMessage());
        }

    };

}
