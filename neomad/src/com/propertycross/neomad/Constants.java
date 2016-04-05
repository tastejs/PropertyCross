package com.propertycross.neomad;

import com.neomades.mad.TargetInfo;

/**
 * List of Condition to be injected into Java Source Code, Resources declaration 
 * 
 * @author Neomades
 */
public class Constants implements TargetInfo {

	/**
	 * Apply or not a background image to Screen
	 */
	public static boolean SCREEN_WITH_BACKGROUND = false;

	/**
	 * Show an icon to a Favourites MenuItem
	 */
	public static boolean FAVOURITES_WITH_ICON = false;
	
	/**
	 * Show an icon to a Favourites MenuItem
	 */
	public static boolean FAVOURITES_SHORT_TEXT = false;

	// === list of font's size === //
	
	public static final int FONT_XXSMALL_SIZE = 12;
	public static final int FONT_XSMALL_SIZE = 14;
	public static final int FONT_SMALL_SIZE = 16;
	public static final int FONT_THIN_SIZE = 18;
	public static final int FONT_MEDIUM_SIZE = 20;
	public static final int FONT_LARGE_SIZE = 22;

	// Package content constants
	public static final String PROPERTIES_CACHE = "com.propertycross.neomad.PROPERTIES_CACHE";
	public static final String PROPERTIES_IMAGES_CACHE = "com.propertycross.neomad.PROPERTIES_IMAGES_CACHE";
	public static final String PROPERTIES_THUMBNAILS_CACHE = "com.propertycross.neomad.PROPERTIES_THUMBNAILS_CACHE";
	public static final String HTTP = "com.propertycross.neomad.HTTP";
	public static final String PROPERTY_PARSER = "com.propertycross.neomad.PROPERTY_PARSER";
	public static final String ROOT_CACHE = "properties";
	public static final int MEMORY_THUMBNAILS_CACHE_LRU_COUNT = 20;

	// Package Content events
	public static final String EVENT_PROPERTY_LIST = "PropertyList";
	
	// EventBus event's types
	public static final String ERROR = "Error";
	public static final String LOAD = "Load";
	public static final String LOAD_COMPLETE = "LoadComplete";
	public static final String SAVE = "Save";
	public static final String UPDATE_FAVORITES = "UpdateFavorites";
	public static final String UPDATE_FAVORITES_COMPLETE = "UpdateFavoritesComplete";
	public static final String UPDATE_LIST = "UpdateList";
	public static final String FIND_BY_NAME = "FindByName";
	public static final String FIND_BY_NAME_RES = "FindByNameRes";
	public static final String FIND_BY_LOCATION = "FindByLocation";
	public static final String FIND_BY_LOCATION_RES = "FindByLocationRes";
	public static final String FOUND_AMBIGIOUS_RES = "FoundAmbigiousRes";
	public static final String FIND_ERROR = "FindError";
	public static final String LOAD_PROPERTIES = "LoadProperties";
	public static final String GET_LOCATION = "GetLocation";
	public static final String GET_LOCATION_RES = "GetLocationRes";
	public static final String NETWORK_ERROR = "NetworkError";
	
	public static final int FOUND_SUCCESS = 0;
	public static final int FOUND_AMBIGUOUS = 1;
	public static final int FOUND_ERROR = 2;
	
	/**
	 * Prints Exception message
	 */
	public static final boolean DEBUG = false;

	public static final String PROPERTY_FINDER_SHORT_TITLE = "Search";

	public static final int FINDER_LIST_MARGIN = 4;

	public static boolean THEME_LIGHT_WITH_DARK_ACTION_BAR = false;

	public static boolean PROPERTY_DETAILS_SUBTITLE = true;
	
	public static boolean RESULTS_HEADER_TITLE_IN_UPPERCASE = true;

	public static boolean SCREEN_WITH_BG_IMAGE = false;

	public static boolean RECENT_SEARCH_COUNT_WITH_PARENTHESIS = false;

	public static boolean RENAME_BACK_BUTTON = false;

	public static String PROPERTY_FINDER_TITLE = "PropertyCross";

	public static boolean FINDER_LIST_WITH_TABLE_STYLE = false;

	// === folders for resources === //
	
	public static String LAYOUT_PATH = "others";
	
	public static String MENU_ITEM_PATH = "others";
	
	public static String LAYOUT_LIST_PATH = "others";
	
	public static int waitColor = -1;

	/**
	 * Conditioning by platform
	 */
	static {
		if (WINDOWS_PHONE) {
			SCREEN_WITH_BG_IMAGE = true;
			LAYOUT_PATH = "metro";
			MENU_ITEM_PATH = "windowsphone";
			LAYOUT_LIST_PATH = "metro";
			FAVOURITES_WITH_ICON = true;
			PROPERTY_DETAILS_SUBTITLE = false;
			RESULTS_HEADER_TITLE_IN_UPPERCASE = false;
		} else if (ANDROID) {
			SCREEN_WITH_BACKGROUND = true;
			RECENT_SEARCH_COUNT_WITH_PARENTHESIS = true;
			THEME_LIGHT_WITH_DARK_ACTION_BAR = true;
		} else if (IOS) {
			waitColor = 0x333333;
			RENAME_BACK_BUTTON = true;
			FAVOURITES_SHORT_TEXT = true;
			PROPERTY_FINDER_TITLE = "Property Finder";
			LAYOUT_LIST_PATH = "ios";
			FINDER_LIST_WITH_TABLE_STYLE = true;
		}
	}
}
