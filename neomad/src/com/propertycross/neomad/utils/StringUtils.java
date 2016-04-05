package com.propertycross.neomad.utils;


/**
 * String utilities
 * 
 * @author Neomades
 */
public final class StringUtils {

	private StringUtils() {
	}

	public static boolean equalsIgnoreCase(String s1, String s2) {
		return s1 == s2 || 
				(s1 != null && s2 != null 
				&& s1.trim().toLowerCase().equals(s2.trim().toLowerCase()));
	}
}
