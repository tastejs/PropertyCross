package com.propertycross.neomad.service;

import com.neomades.app.Controller;
import com.propertycross.neomad.event.Event;

/**
 * @author Neomades
 */
public abstract class PropertyService implements EventListener {

	private EventListener busService;

	/**
	 * @param busService
	 */
	protected PropertyService(EventListener busService) {
		this.busService = busService;
	}

	/* Sends event to the eventBus
	 */
	public void send(Event e) {
		busService.receive(e);
	}

	public void receive(Event e) {

	}
	
	public void close(Controller controller) {
		// by default do nothing
	}
}
