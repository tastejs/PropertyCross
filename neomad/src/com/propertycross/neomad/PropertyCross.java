package com.propertycross.neomad;

import com.neomades.app.Application;
import com.neomades.app.Controller;
import com.neomades.app.ScreenParams;
import com.propertycross.neomad.screen.PropertyFinder;
import com.propertycross.neomad.screen.PropertySplash;
import com.propertycross.neomad.service.EventListener;
import com.propertycross.neomad.service.ServicesManager;
import com.propertycross.neomad.service.impl.GlobalServicesManager;

/**
 * Application Entry Point
 * 
 * @author Neomades
 */
public class PropertyCross extends Application {

	/**
	 * Global services manager
	 */
	private static final GlobalServicesManager SERVICES_MANAGER = new GlobalServicesManager();

	/**
	 * Gets the global event manager
	 * 
	 * @return the global ServicesManager
	 */
	public static final ServicesManager getServicesManager() {
		return SERVICES_MANAGER;
	}

	protected void onStart(Controller controller) {
		// Web Services initialization
		SERVICES_MANAGER.registerServices(controller);

		// Enable actionBar on android
		// and lock the application to be in Portrait mode
		setActionBarEnabled(true);
		setSupportedOrientation(PORTRAIT);
		
		if (Constants.THEME_LIGHT_WITH_DARK_ACTION_BAR) {
		   setActionBarTheme(THEME_DARK);
		   setForcedTheme(THEME_LIGHT);
		}

		// Go to the first screen
		showPropertyFinderScreen(controller);
	}

	/**
	 * @param controller
	 */
	private void showPropertyFinderScreen(Controller controller) {
		ScreenParams screenParams = new ScreenParams();
		
		// Give in parameter MessageBus
		screenParams.putObject(EventListener.class.getName(), SERVICES_MANAGER.getEventListener());
		Class firstScreen = PropertyFinder.class;
		if (Constants.SPLASH_ENABLED) {
			firstScreen = PropertySplash.class;
		}
		controller.pushScreen(firstScreen, screenParams);
	}

	protected boolean onBeforeExit(Controller controller) {
		
		// Web services unregistration
		SERVICES_MANAGER.unregisterServices(controller);
		
		return super.onBeforeExit(controller);
	}

}
