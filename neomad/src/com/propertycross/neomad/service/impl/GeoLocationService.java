package com.propertycross.neomad.service.impl;

import java.util.Stack;

import com.neomades.app.Controller;
import com.neomades.location.Location;
import com.neomades.location.LocationListener;
import com.neomades.location.LocationManager;
import com.propertycross.neomad.event.CallbackEvent;
import com.propertycross.neomad.event.Event;
import com.propertycross.neomad.service.EventListener;
import com.propertycross.neomad.service.PropertyService;

/**
 * @author Neomades
 */
public class GeoLocationService extends PropertyService implements
		LocationListener {

	private static final Stack EVENTS = new Stack();
	
	public static final String SERVICE_NAME = "GeoLocationService";

	public GeoLocationService(EventListener busService) {
		super(busService);
	}

	public void onLocationChanged(Location location) {
		if (!EVENTS.empty()) {
			Event event = (Event) EVENTS.pop();
			if (event instanceof CallbackEvent) {
				((CallbackEvent) event).onComplete(location);
			} else {
				send(new Event(location, SERVICE_NAME, event.getSender()
						.toString(), Event.Type.GET_LOCATION_RES));
			}
			if (EVENTS.empty()) {
				// close the Location Manager,
				// if this event is the last one
				doClose();
			}
		}
	}

	public void receive(Event e) {
		if (e.getType() == Event.Type.GET_LOCATION) {
			EVENTS.push(e);
			LocationManager.getDefault().requestMyLocation(this);
		}
	}

	public void close(Controller controller) {
		doClose();
	}

	private void doClose() {
		LocationManager.getDefault().stop();
	}
}
