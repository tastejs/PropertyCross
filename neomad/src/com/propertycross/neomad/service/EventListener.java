package com.propertycross.neomad.service;

import com.propertycross.neomad.event.Event;

/**
 * @author Neomades
 */
public interface EventListener {

	void send(Event e);

	void receive(Event e);
}
