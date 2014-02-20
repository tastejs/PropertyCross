package com.propertycross.neomad.utils;

import java.io.IOException;
import java.io.InputStream;

import com.neomades.io.file.File;
import com.neomades.io.file.FileOutputStream;
import com.neomades.util.IOUtils;

/**
 * InputStream utilities.
 * 
 * @author Neomades
 */
public final class StreamUtils {

	private StreamUtils() {
	}

	/**
	 * Copies data stream to file
	 * 
	 * @param in
	 *            the data to copy
	 * @param ou
	 *            the file where to write
	 */
	public static void copy(InputStream in, File ou) {
		try {
			FileOutputStream fs = new FileOutputStream(ou);
			try {
				fs.write(IOUtils.toByteArray(in));
				fs.flush();
				fs.close();
			} catch (IOException e) {
				Log.d(e.getMessage());
			} finally {
				if (fs != null) {
					try {
						fs.close();
					} catch (IOException e) {
						Log.d(e.getMessage());
					}
				}
			}

		} catch (Exception ex) {
			Log.d(ex.getMessage());
		}
	}
}
