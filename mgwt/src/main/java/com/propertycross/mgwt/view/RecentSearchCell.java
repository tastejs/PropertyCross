package com.propertycross.mgwt.view;

import com.google.gwt.core.client.GWT;
import com.google.gwt.safehtml.client.SafeHtmlTemplates;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlBuilder;
import com.googlecode.mgwt.ui.client.widget.celllist.Cell;
import com.propertycross.mgwt.locations.Search;

public class RecentSearchCell  implements Cell<Search>{

	private static final Template TEMPLATE = GWT.create(Template.class);
  public interface Template extends SafeHtmlTemplates {

      @SafeHtmlTemplates.Template("<div class='recentSearchesListItem'>{0} <div class='totalPropertiesCount'>{1}</div></div>"
      )
      SafeHtml content(String location, int results);

  }
  
	@Override
  public void render(SafeHtmlBuilder safeHtmlBuilder, Search model) {
		safeHtmlBuilder.append(TEMPLATE.content(model.displayText(), model.numberProperties()));
  }

	@Override
  public boolean canBeSelected(Search model) {
	  return false;
  }
}
