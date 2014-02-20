package com.propertycross.neomad.utils;

import com.propertycross.neomad.Constants;

/**
 * @author Neomades
 */
public final class Log {

	private Log() {
	}

	/**
	 * Show degug message in the console
	 * 
	 * @param msg message object
	 */
	public static void d(Object msg) {
		if (Constants.DEBUG) {
			System.out.println(msg.toString()); // NOSONAR
		}
	}

}
