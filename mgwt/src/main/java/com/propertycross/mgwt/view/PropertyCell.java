package com.propertycross.mgwt.view;

import com.google.gwt.core.client.GWT;
import com.google.gwt.safehtml.client.SafeHtmlTemplates;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlBuilder;
import com.google.gwt.safehtml.shared.SafeUri;
import com.googlecode.mgwt.ui.client.widget.celllist.Cell;
import com.propertycross.mgwt.properties.Property;

public class PropertyCell implements Cell<Property>{

	private static final Template TEMPLATE = GWT.create(Template.class);
  public interface Template extends SafeHtmlTemplates {

      @SafeHtmlTemplates.Template("<img src=\"{0}\" />" +
          "<span><div>{1}</div><div>{2}</div></span>"
      )
      SafeHtml content(SafeUri imgUrl, String price, String summary);

  }
  
	@Override
  public void render(SafeHtmlBuilder safeHtmlBuilder, Property model) {
		safeHtmlBuilder.append(TEMPLATE.content(model.imgUrl(),
				model.formattedPrice(), model.summary()));
  }

	@Override
  public boolean canBeSelected(Property model) {
	  // TODO Auto-generated method stub
	  return false;
  }

}
