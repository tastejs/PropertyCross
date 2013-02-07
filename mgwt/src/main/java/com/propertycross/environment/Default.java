package com.propertycross.environment;

import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.ui.RootPanel;
import com.googlecode.gwtphonegap.client.PhoneGap;
import com.googlecode.gwtphonegap.client.event.*;
import static com.googlecode.mgwt.mvp.client.Animation.*;
import com.googlecode.mgwt.ui.client.MGWT;
import com.googlecode.mgwt.ui.client.OsDetection;
import com.googlecode.mgwt.ui.client.animation.AnimationHelper;
import com.propertycross.navigation.AnimatedNavigator;
import com.propertycross.navigation.Navigation;
import com.propertycross.navigation.NavigationManager;
import com.propertycross.properties.PropertiesManager;
import com.propertycross.ui.FavouritesPage;

final class Default implements Environment {

    private final NavigationManager nav;
    private final PhoneGap phoneGap = GWT.create(PhoneGap.class);
    private final PropertiesManager favourites;

    public Default(PropertiesManager favourites)
    {
        this.favourites = favourites;
        AnimationHelper animationHelper = new AnimationHelper();
        RootPanel.get().add(animationHelper);
        nav = new NavigationManager(
                new AnimatedNavigator(animationHelper, SLIDE),
                new AnimatedNavigator(animationHelper, SLIDE_REVERSE));

        addMenuBtnHandler();

        addBackBtnHandler();
    }

    private void addMenuBtnHandler()
    {
        HasMenuButtonPressedHandlers h = phoneGap.getEvent().getMenuButton();
        h.addMenuButtonPressedHandler(new MenuButtonPressedHandler() {
            @Override public void onMenuButtonPressed(MenuButtonPressedEvent e)
            {
                nav.goTo(new FavouritesPage(nav, favourites));
            }
        });
    }

    private void addBackBtnHandler()
    {
        HasBackButtonPressedHandlers h = phoneGap.getEvent().getBackButton();
        h.addBackButtonPressedHandler(new BackButtonPressedHandler() {
            @Override public void onBackButtonPressed(BackButtonPressedEvent e)
            {
                if(!nav.hasHistory()) {
                    phoneGap.exitApp();
                }
                nav.goBack();
            }
        });
    }

    @Override
    public String appName()
    {
        String title = "Property Cross";
        OsDetection os = MGWT.getOsDetection();
        if(os.isPhone()) return title + " Phone";
        if(os.isTablet()) return title + " Tablet";
        return title;
    }

    @Override
    public Navigation createNavigator()
    {
        return nav;
    }

}
