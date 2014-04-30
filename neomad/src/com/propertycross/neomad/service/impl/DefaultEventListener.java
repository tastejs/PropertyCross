package com.propertycross.neomad.service.impl;

import java.util.Stack;

import com.neomades.app.Controller;
import com.propertycross.neomad.PropertyCross;
import com.propertycross.neomad.event.Event;
import com.propertycross.neomad.service.EventListener;

/**
 * @author Neomades
 */
public class DefaultEventListener implements EventListener {

	private static final Stack MESSAGES = new Stack();
	
	private Controller root;

	public DefaultEventListener(Controller root) {
		this.root = root;
	}

	public void send(Event e) {
		EventListener service = getService(e.getTarget());
		if (service != null) {
			service.receive(e);
		}
	}

	public void receive(Event e) {
		synchronized (MESSAGES) {
			MESSAGES.push(e);
			if (!MESSAGES.empty()) {
				root.runOnUiThread(new Runnable() {
					public void run() {
						while (!MESSAGES.empty()) {
							send((Event) MESSAGES.pop());
						}
					}
				});
			}
		}
	}

	private EventListener getService(String name) {
		return PropertyCross.getServicesManager().getService(name);
	}
}
