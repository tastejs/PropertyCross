package com.propertycross.neomad.utils;

import com.neomades.graphics.Font;
import com.propertycross.neomad.Constants;

/**
 * List of fonts used by the application
 * 
 * @author Neomades
 */
public final class Fonts {
	
	public static final Font DEFAULT_PLAIN_XXSMALL = Font.createFont(Font.DEFAULT, Font.STYLE_PLAIN, Constants.FONT_XXSMALL_SIZE);
	public static final Font DEFAULT_PLAIN_XSMALL = Font.createFont(Font.DEFAULT, Font.STYLE_PLAIN, Constants.FONT_XSMALL_SIZE);
	public static final Font DEFAULT_PLAIN_SMALL = Font.createFont(Font.DEFAULT, Font.STYLE_PLAIN, Constants.FONT_SMALL_SIZE);
	public static final Font DEFAULT_PLAIN_THIN = Font.createFont(Font.DEFAULT, Font.STYLE_PLAIN, Constants.FONT_THIN_SIZE);
	public static final Font DEFAULT_PLAIN_MEDIUM = Font.createFont(Font.DEFAULT, Font.STYLE_PLAIN, Constants.FONT_MEDIUM_SIZE);
	public static final Font DEFAULT_PLAIN_LARGE = Font.createFont(Font.DEFAULT, Font.STYLE_PLAIN, Constants.FONT_LARGE_SIZE);
	public static final Font SCREEN_TITLE_FONT = Font.createFont(Font.DEFAULT, Font.STYLE_PLAIN, Constants.FONT_LARGE_SIZE);
	public static final Font DEFAULT_BOLD_XSMALL = Font.createFont(Font.DEFAULT, Font.STYLE_BOLD, Constants.FONT_XSMALL_SIZE);

	private Fonts() {
	}

}