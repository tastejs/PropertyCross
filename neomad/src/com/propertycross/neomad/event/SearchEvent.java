package com.propertycross.neomad.event;

import com.propertycross.neomad.service.impl.NetworkService;

/**
 * @author Neomades
 */
public class SearchEvent extends Event {

	private String location;
	private Double latitude;
	private Double longitude;
	private Integer page;

	public SearchEvent(String sender, String location, int page) {
		super(null, sender, NetworkService.SERVICE_NAME, Type.FIND_BY_NAME);
		this.location = location;
		this.page = new Integer(page);
	}

	public SearchEvent(String sender, double latitude, double longitude, int page) {
		super(null, sender, NetworkService.SERVICE_NAME, Type.FIND_BY_PLACE);
		this.page = new Integer(page);
		this.latitude = new Double(latitude);
		this.longitude = new Double(longitude);
	}

	public String getLocation() {
		return location;
	}

	public Double getLatitude() {
		return latitude;
	}

	public Double getLongitude() {
		return longitude;
	}

	public Integer getPage() {
		return page;
	}

	public Event getEvent() {
		return this;
	}
}
