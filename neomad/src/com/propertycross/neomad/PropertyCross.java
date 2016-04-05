package com.propertycross.neomad;

import com.neomades.app.Application;
import com.neomades.app.Controller;
import com.neomades.content.ContentManager;
import com.neomades.content.cache.FileCache;
import com.neomades.content.network.HttpNetwork;
import com.neomades.event.EventReceiver;
import com.neomades.io.file.File;
import com.neomades.io.file.FileStorage;
import com.neomades.mad.TargetInfo;
import com.propertycross.neomad.screen.PropertyFinder;
import com.propertycross.neomad.services.PropertyCrossEventReceiver;
import com.propertycross.neomad.services.PropertyListParser;


/**
 * Entry point
 */
public class PropertyCross extends Application {

	private ContentManager manager;
	private EventReceiver eventReceiver;
	

	public void onStart(Controller controller) {
		// Set up the ContentManager
		// Cache : a FileCache
		// Network : Http
		// Parsers : Properties Parser - JSON
		manager = new ContentManager();
		manager.putCache(Constants.PROPERTIES_CACHE, new FileCache(new File(
				getAppCacheDir(), Constants.ROOT_CACHE)));
		manager.putNetwork(Constants.HTTP, new HttpNetwork());
		manager.putParser(Constants.PROPERTY_PARSER, new PropertyListParser());

		// Starting an eventBus between Screen and ContentManager
		setEventBusEnabled(true);
		eventReceiver = new PropertyCrossEventReceiver();
		this.getEventBus().register(eventReceiver);
		
		// Register a ContentManager to this application
		registerContentManager(manager);
		
		// Enable actionBar on android
		// and lock the application to be in Portrait mode
		setActionBarEnabled(true);
		setSupportedOrientation(PORTRAIT);
		
		if (Constants.THEME_LIGHT_WITH_DARK_ACTION_BAR) {
		   setActionBarTheme(THEME_DARK);
		   setForcedTheme(THEME_LIGHT);
		}
		
		// Go to the first screen
		controller.pushScreen(PropertyFinder.class);
	}
	
	public static File getAppCacheDir() {
		File cacheDir = null;
		if (TargetInfo.WINDOWS_PHONE) {
			// no cache dir on windows phone
			cacheDir = FileStorage.getPrivateDir();
		} else {
			cacheDir = FileStorage.getCacheDir();
		}
		return cacheDir;
	}	
} 