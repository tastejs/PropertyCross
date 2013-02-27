package com.propertycross.mgwt.view;

import com.google.gwt.core.client.GWT;
import com.google.gwt.safehtml.client.SafeHtmlTemplates;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlBuilder;
import com.google.gwt.safehtml.shared.SafeUri;
import com.googlecode.mgwt.ui.client.widget.celllist.Cell;
import com.propertycross.mgwt.locations.Location;
import com.propertycross.mgwt.properties.Property;

public class LocationCell implements Cell<Location>{

	private static final Template TEMPLATE = GWT.create(Template.class);
  public interface Template extends SafeHtmlTemplates {

      @SafeHtmlTemplates.Template("{0}"
      )
      SafeHtml content(String location);

  }
  
	@Override
  public void render(SafeHtmlBuilder safeHtmlBuilder, Location model) {
		safeHtmlBuilder.append(TEMPLATE.content(model.getDisplayName()));
  }

	@Override
  public boolean canBeSelected(Location model) {
	  // TODO Auto-generated method stub
	  return false;
  }

}
