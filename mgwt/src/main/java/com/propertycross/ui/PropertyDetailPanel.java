package com.propertycross.ui;

import com.google.gwt.user.client.ui.*;
import com.googlecode.mgwt.dom.client.event.tap.TapEvent;
import com.googlecode.mgwt.dom.client.event.tap.TapHandler;
import com.googlecode.mgwt.ui.client.widget.Button;
import com.propertycross.navigation.Navigable;
import com.propertycross.properties.PropertiesManager;
import com.propertycross.properties.Property;


public final class PropertyDetailPanel implements Navigable {

    private final VerticalPanel vp = new VerticalPanel();
    private final Button favouritesBtn;

    public PropertyDetailPanel(PropertiesManager favourites, Property p)
    {
        vp.add(new SelectableLabel(p.formattedPrice()));
        vp.add(new SelectableLabel(p.title()));
        vp.add(new Image(p.imgUrl()));
        vp.add(new SelectableLabel(p.summary()));

        favouritesBtn = favouritesBtn(favourites, p);
    }

    private Button favouritesBtn(final PropertiesManager favourites,
            final Property p)
    {
        final Button btn = new Button(favourites.isFavourite(p) ?
                "Remove Favourite" : "Add Favourite");
        btn.addTapHandler(new TapHandler() {

            @Override public void onTap(TapEvent event)
            {
                if(favourites.isFavourite(p)) {
                    favourites.removeFavourite(p);
                    btn.setText("Add Favourite");
                }
                else {
                    favourites.addFavourite(p);
                    btn.setText("Remove Favourite");
                }
            }

        });
        return btn;
    }

    @Override
    public void addTo(HasWidgets panel)
    {
        panel.add(vp);
        panel.add(favouritesBtn);
    }

}
