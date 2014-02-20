package com.propertycross.neomad.event;

/**
 * @author Neomades
 */
public class Event {
	public static class Type {
		public static final char ERROR = 0x01;
		public static final char LOAD = 0x02;
		public static final char SAVE = 0x03;
		public static final char UPDATE = 0x04;
		public static final char UPDATE_LIST = 0x05;
		public static final char FIND_BY_NAME = 0x06;
		public static final char FIND_BY_NAME_RES = 0x07;
		public static final char FIND_BY_LOCATION_RES = 0x08;
		public static final char FIND_BY_PLACE = 0x09;
		public static final char FIND_BY_PLACE_RES = 0x0a;
		public static final char FIND_ERROR = 0x0b;
		public static final char LOAD_PROPERTIES = 0x0c;
		public static final char GET_LOCATION = 0x0d;
		public static final char GET_LOCATION_RES = 0x0d;
		public static final char NETWORK_ERROR = 0x0e;
	}

	private Object value;
	private Object sender;
	private String target;
	private char type;

	public Event(Object value, Object sender, String target, char type) {
		this.value = value;
		this.sender = sender;
		this.target = target;
		this.type = type;
	}

	public Object getValue() {
		return value;
	}

	public Object getSender() {
		return sender;
	}

	public String getTarget() {
		return target;
	}

	public char getType() {
		return type;
	}
}
