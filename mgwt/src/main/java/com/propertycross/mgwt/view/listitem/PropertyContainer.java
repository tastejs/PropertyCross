package com.propertycross.mgwt.view.listitem;

import com.propertycross.mgwt.properties.Property;

public class PropertyContainer extends ListItem
{
	private final Property property;

	public PropertyContainer(Property property) {
    this.property = property;
  }

	public Property getProperty() {
  	return property;
  }
}
