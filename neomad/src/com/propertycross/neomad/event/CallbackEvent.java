package com.propertycross.neomad.event;

/**
 * @author Neomades
 */
public abstract class CallbackEvent extends Event {
	
	/**
	 * 
	 * @param sender
	 * @param target
	 * @param type
	 */
	protected CallbackEvent(Object sender, String target, char type) {
		super(null, sender, target, type);
	}

	/**
	 * @param result
	 */
	public abstract void onComplete(Object result);
}
