package com.propertycross.ui;

import com.google.gwt.user.client.ui.HasWidgets;
import java.util.ArrayList;
import java.util.List;
import com.propertycross.navigation.Navigable;
import com.propertycross.navigation.Navigation;
import com.propertycross.properties.PropertiesManager;
import com.propertycross.properties.Property;
import com.propertycross.ui.PropertySummaryPage.PropCell;
import com.propertycross.ui.ScrollableCellList.ClickableCell;


public final class FavouritesPage implements Navigable {

    private final Navigation nav;
    private final ScrollableCellList cl = new ScrollableCellList();
    private final PropertiesManager favourites;

    public FavouritesPage(Navigation nav, PropertiesManager favourites)
    {
        this.nav = nav;
        this.favourites = favourites;
        cl.render(generateCells(favourites.loadFavourites()));
    }

    @Override
    public void addTo(HasWidgets panel)
    {
        cl.addTo(panel);
    }

    private List<ClickableCell> generateCells(List<Property> props)
    {
        List<ClickableCell> cells = new ArrayList<ClickableCell>();
        for(Property p : props) {
            cells.add(new PropCell(p, nav, favourites));
        }
        return cells;
    }

}
