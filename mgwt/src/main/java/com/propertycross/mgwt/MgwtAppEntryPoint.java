package com.propertycross.mgwt;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.GWT.UncaughtExceptionHandler;
import com.google.gwt.user.client.Window;
import com.googlecode.mgwt.storage.client.LocalStorageGwtImpl;
import com.googlecode.mgwt.storage.client.Storage;
import com.propertycross.mgwt.environment.Environment;
import com.propertycross.mgwt.environment.EnvironmentLookup;
import com.propertycross.mgwt.locations.OrderedSearchesManager;
import com.propertycross.mgwt.locations.SearchesManager;
import com.propertycross.mgwt.navigation.Navigation;
import com.propertycross.mgwt.nestoria.RequestSender;
import com.propertycross.mgwt.nestoria.gwt.GwtRequestSender;
import com.propertycross.mgwt.properties.OrderedPropertiesManager;
import com.propertycross.mgwt.properties.PropertiesManager;
import com.propertycross.mgwt.ui.MainPage;
import java.util.logging.Level;
import java.util.logging.Logger;

public class MgwtAppEntryPoint implements EntryPoint {

    private final Storage storage = new LocalStorageGwtImpl();
    private final SearchesManager recentSearches =
            new OrderedSearchesManager(storage, 5);
    private final RequestSender requestSender = new GwtRequestSender();
    private final PropertiesManager favourites =
            new OrderedPropertiesManager(storage);

    @Override
    public void onModuleLoad()
    {
        setExceptionHandler();

        Environment env = new EnvironmentLookup(favourites).detect();

        Window.setTitle(env.appName());

        Navigation nav = env.createNavigator();

        nav.goTo(new MainPage(nav, requestSender, recentSearches, favourites));
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
