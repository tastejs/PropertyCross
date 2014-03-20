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

	/**
	 * Prints Exception message
	 */
	public static final boolean DEBUG = false;

	public static final String PROPERTY_FINDER_SHORT_TITLE = "Search";

	public static final int FINDER_LIST_MARGIN = 4;



	public static boolean THEME_LIGHT_WITH_DARK_ACTION_BAR = false;

	public static boolean PROPERTY_DETAILS_SUBTITLE = true;

	public static boolean SPLASH_ENABLED = false;

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
		if (WINDOWS_PHONE_7) {
			SCREEN_WITH_BG_IMAGE = true;
			LAYOUT_PATH = "metro";
			MENU_ITEM_PATH = "metro";
			LAYOUT_LIST_PATH = "metro";
			FAVOURITES_WITH_ICON = true;
			SPLASH_ENABLED = true;
			PROPERTY_DETAILS_SUBTITLE = false;
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
