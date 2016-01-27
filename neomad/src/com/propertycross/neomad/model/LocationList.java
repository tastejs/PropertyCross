package com.propertycross.neomad.model;

import java.util.Vector;

/**
 * @author Neomades
 */
public class LocationList {

	private Vector locations;

	
	public LocationList() {
		this.locations = new Vector();
	}
	
	public Vector getLocations() {
		return locations;
	}
	
	public Location getLocation(int index) {
		return (Location) locations.elementAt(index);
	}
	
	public boolean isEmpty() {
		return locations.isEmpty();
	}
	
	public void addLocation(Location l) {
		this.locations.addElement(l);
	}
	
	public int getSize() {
		return this.locations.size();
	}
}
