package com.propertycross.neomad.utils;

import java.util.Vector;

/**
 * String utilities
 * 
 * @author Neomades
 */
public final class StringUtils {
	
	private StringUtils() {
	}
	
	/**
	 * @param str
	 * @param split
	 * @return
	 */
	public static String[] split(String str, String split) {

		Vector tmp = new Vector();
		int index = 0;
		int find = 0;
		while ((find = str.indexOf(split, index)) > index) {
			tmp.addElement(str.substring(index, find));
			index = find + split.length();
		}

		if (index + split.length() < str.length()) {
			tmp.addElement(str.substring(index + split.length() - 1));
		}

		String[] ret = new String[tmp.size()];

		for (int i = 0; i < tmp.size(); i++) {
			ret[i] = (String) tmp.elementAt(i);
		}

		return ret;
	}
}
