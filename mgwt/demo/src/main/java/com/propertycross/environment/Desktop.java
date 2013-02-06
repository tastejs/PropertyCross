package com.propertycross.environment;

import com.google.gwt.user.client.ui.RootPanel;
import com.googlecode.mgwt.dom.client.event.tap.TapEvent;
import com.googlecode.mgwt.dom.client.event.tap.TapHandler;
import static com.googlecode.mgwt.mvp.client.Animation.*;
import com.googlecode.mgwt.ui.client.animation.AnimationHelper;
import com.googlecode.mgwt.ui.client.widget.HeaderButton;
import com.propertycross.navigation.AnimatedNavigator;
import com.propertycross.navigation.HeaderButtonDecorator;
import com.propertycross.navigation.Navigation;
import com.propertycross.navigation.Navigator;
import com.propertycross.properties.PropertiesManager;
import com.propertycross.ui.FavouritesPage;

final class Desktop implements Environment {

    private final AnimationHelper animationHelper;
    private final PropertiesManager favourites;

    public Desktop(PropertiesManager favourites)
    {
        animationHelper = new AnimationHelper();
        RootPanel.get().add(animationHelper);
        this.favourites = favourites;
    }

    @Override
    public String appName()
    {
        return "Property Cross Desktop";
    }

    @Override
    public Navigation createNavigator()
    {
        Navigator forward = new AnimatedNavigator(animationHelper, SLIDE);
        Navigator back = new AnimatedNavigator(animationHelper, SLIDE_REVERSE);

        final HeaderButtonDecorator manager =
                new HeaderButtonDecorator(forward, back);

        HeaderButton menuBtn = new HeaderButton();
        menuBtn.setText("Menu");
        menuBtn.addTapHandler(new TapHandler() {
            @Override public void onTap(TapEvent e)
            {
                manager.goTo(new FavouritesPage(manager, favourites));
            }
        });
        manager.setCenterButton(menuBtn);

        HeaderButton backBtn = new HeaderButton();
        backBtn.setText("Back");
        backBtn.setBackButton(true);
        backBtn.addTapHandler(new TapHandler() {
            @Override public void onTap(TapEvent e)
            {
                manager.goBack();
            }
        });
        manager.setLeftButton(backBtn);

        return manager;
    }

}
