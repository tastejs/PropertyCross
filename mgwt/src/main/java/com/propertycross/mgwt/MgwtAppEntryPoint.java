package com.propertycross.mgwt;

import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.GWT.UncaughtExceptionHandler;
import com.google.gwt.place.shared.PlaceController;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.web.bindery.event.shared.SimpleEventBus;
import com.googlecode.mgwt.mvp.client.AnimatableDisplay;
import com.googlecode.mgwt.mvp.client.AnimatingActivityManager;
import com.googlecode.mgwt.mvp.client.Animation;
import com.googlecode.mgwt.mvp.client.history.MGWTPlaceHistoryHandler;
import com.googlecode.mgwt.storage.client.LocalStorageGwtImpl;
import com.googlecode.mgwt.storage.client.Storage;
import com.googlecode.mgwt.ui.client.MGWT;
import com.googlecode.mgwt.ui.client.MGWTSettings;
import com.googlecode.mgwt.ui.client.MGWTSettings.ViewPort;
import com.googlecode.mgwt.ui.client.MGWTSettings.ViewPort.DENSITY;
import com.googlecode.mgwt.ui.client.animation.AnimationHelper;
import com.googlecode.mgwt.ui.client.widget.Button;
import com.googlecode.mgwt.ui.client.widget.LayoutPanel;
import com.propertycross.mgwt.environment.Environment;
import com.propertycross.mgwt.environment.EnvironmentLookup;
import com.propertycross.mgwt.locations.OrderedSearchesManager;
import com.propertycross.mgwt.locations.SearchesManager;
import com.propertycross.mgwt.nestoria.RequestSender;
import com.propertycross.mgwt.nestoria.gwt.GwtRequestSender;
import com.propertycross.mgwt.place.PropertyCrossPlace;
import com.propertycross.mgwt.properties.OrderedPropertiesManager;
import com.propertycross.mgwt.properties.PropertiesManager;

public class MgwtAppEntryPoint implements EntryPoint {

    private final Storage storage = new LocalStorageGwtImpl();
    private final SearchesManager recentSearches =
            new OrderedSearchesManager(storage, 5);
    private final RequestSender requestSender = new GwtRequestSender();
    private final PropertiesManager favourites = new OrderedPropertiesManager(storage);
    
    public static PlaceController placeController;
    private static AnimatableDisplay animatableDisplay;

   // @Override
    public void onModuleLoad2()
    {
   // set viewport and other settings for mobile
      MGWT.applySettings(MGWTSettings.getAppSetting());

      // build animation helper and attach it
      AnimationHelper animationHelper = new AnimationHelper();
      RootPanel.get().add(animationHelper);

      // build some UI
      LayoutPanel layoutPanel = new LayoutPanel();
      Button button = new Button("Hello mgwt");
      layoutPanel.add(button);

      // animate
      animationHelper.goTo(layoutPanel, Animation.SLIDE);
    }
    
    @Override
    public void onModuleLoad()
    {
        setExceptionHandler();

        Environment env = new EnvironmentLookup(favourites).detect();

       /* Window.setTitle(env.appName());

        Navigation nav = env.createNavigator();

        nav.goTo(new MainPage(nav, requestSender, recentSearches, favourites));*/
        
        SimpleEventBus eventBus = new SimpleEventBus();
        placeController = new PlaceController(eventBus);

        prepareViewPort();

        AppPlaceHistoryMapper historyMapper = GWT.create(AppPlaceHistoryMapper.class);

        animatableDisplay = GWT.create(AnimatableDisplay.class);

        PhoneActivityMapper appActivityMapper = new PhoneActivityMapper();
        PhoneAnimationMapper appAnimationMapper = new PhoneAnimationMapper();
        AnimatingActivityManager activityManager =
            new AnimatingActivityManager(appActivityMapper, appAnimationMapper, eventBus);

        activityManager.setDisplay(animatableDisplay);
        RootPanel.get().add(animatableDisplay);


        AppHistoryObserver historyObserver = new AppHistoryObserver();

        MGWTPlaceHistoryHandler historyHandler = new MGWTPlaceHistoryHandler(historyMapper, historyObserver);

        historyHandler.register(placeController, eventBus, new PropertyCrossPlace());
        historyHandler.handleCurrentHistory();
    }
    
    private void prepareViewPort() {
        ViewPort viewPort = new MGWTSettings.ViewPort();
        viewPort.setTargetDensity(DENSITY.MEDIUM);
        viewPort.setUserScaleAble(false).setMinimumScale(1.0).setMinimumScale(1.0).setMaximumScale(1.0);
        viewPort.setWidthToDeviceWidth();

        MGWTSettings settings = new MGWTSettings();
        settings.setViewPort(viewPort);
        settings.setIconUrl("logo.png");
        settings.setAddGlosToIcon(true);
        settings.setFullscreen(true);
        settings.setPreventScrolling(true);

        MGWT.applySettings(settings);
      }

    private void setExceptionHandler()
    {
        GWT.setUncaughtExceptionHandler(new UncaughtExceptionHandler() {

            private final Logger logger = Logger.getLogger("mgwt test");

            @Override public void onUncaughtException(Throwable ex)
            {
                logger.log(Level.SEVERE, "uncaught", ex);
                Window.alert("uncaught exception, see logs");
            }

        });
    }

}
