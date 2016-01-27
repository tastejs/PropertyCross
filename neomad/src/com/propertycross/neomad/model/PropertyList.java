package com.propertycross.neomad.model;

import java.util.Vector;

public class PropertyList {
	
	private final Vector items = new Vector();
	private int count;
	private int pages;
	private int page;
	
	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public int getPages() {
		return pages;
	}

	public void setPages(int pages) {
		this.pages = pages;
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public void add(Property propertyItem) {
		items.addElement(propertyItem);
	}

	public Property get(int i) {
		return (Property)items.elementAt(i);
	}

	public Vector getData() {
		return items;
	}
	
	public int size() {
		return items.size();
	}
	
}
