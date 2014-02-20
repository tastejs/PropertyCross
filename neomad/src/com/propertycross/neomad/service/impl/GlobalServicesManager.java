package com.propertycross.neomad.service.impl;

import java.util.Enumeration;
import java.util.Hashtable;

import com.neomades.app.Controller;
import com.propertycross.neomad.adapter.screen.ScreenAdapter;
import com.propertycross.neomad.service.EventListener;
import com.propertycross.neomad.service.PropertyService;
import com.propertycross.neomad.service.ServicesManager;

/**
 * Global Services Manager.
 * <p>
 * This class message event to be published over all services.
 * </p>
 * 
 * @author Neomades
 */
public class GlobalServicesManager implements ServicesManager {

	/**
	 * List of PropertyService
	 */
	private static final Hashtable SERVICES = new Hashtable();
	
	/**
	 * List of {@link ScreenAdapter}
	 */
	private static final Hashtable SCREENS = new Hashtable();
	
	/**
	 * Global event listener
	 */
	private static EventListener message;

	public EventListener getService(String service) {
		EventListener listener = null;
		if (EventListener.class.getName().equals(service)) {
			listener = message;
		} else {
			listener = (EventListener) SERVICES.get(service);
			if (listener == null) {
				listener = (EventListener) SCREENS.get(service);
			}
		}
		return listener;
	}

	public void register(ScreenAdapter service) {
		SERVICES.remove(service);
		SCREENS.put(service.getName(), service);
	}

	/**
	 * Register WebServvices, GeoLocation, Persistence
	 * 
	 * @param controller
	 */
	public void registerServices(Controller controller) {
		message = new DefaultEventListener(controller);
		putService(NetworkService.SERVICE_NAME, new NetworkService(message));
		putService(PersistenceService.SERVICE_NAME, new PersistenceService(message));
		putService(GeoLocationService.SERVICE_NAME, new GeoLocationService(message));
	}

	/**
	 * @param name
	 * @param service
	 */
	private void putService(String name, PropertyService service) {
		SCREENS.remove(service);
		SERVICES.put(name, service);
	}
	
	/**
	 * Unregisters all services
	 * 
	 * @param controller
	 */
	public void unregisterServices(Controller controller) {
		Enumeration srv = SERVICES.elements();
		while (srv.hasMoreElements()) {
			PropertyService next = (PropertyService)srv.nextElement();
			next.close(controller);
		}
		SERVICES.clear();
		SCREENS.clear();
		message = null;
	}

	/**
	 * Gets the global event listener
	 * 
	 * @return the global event listener
	 */
	public EventListener getEventListener() {
		return message;
	}
}
