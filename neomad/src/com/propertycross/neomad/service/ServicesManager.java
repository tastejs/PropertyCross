package com.propertycross.neomad.service;

import com.propertycross.neomad.adapter.screen.ScreenAdapter;

/**
 * @author Neomades
 */
public interface ServicesManager {

	/**
	 * @param service
	 * @return
	 */
	EventListener getService(String service);

	/**
	 * @param service
	 */
	void register(ScreenAdapter service);
}
