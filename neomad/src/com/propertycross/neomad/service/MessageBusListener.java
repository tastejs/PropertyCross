package com.propertycross.neomad.service;

import com.propertycross.neomad.event.Event;

/**
 * @author Neomades
 */
public interface MessageBusListener {

    /**
     * @param e
     */
    void send(Event e);

    /**
     * @param e
     */
    void receive(Event e);
}
