package com.propertycross.mgwt.view;

import com.google.gwt.core.client.GWT;
import com.google.gwt.safehtml.client.SafeHtmlTemplates;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlBuilder;
import com.google.gwt.safehtml.shared.SafeUri;
import com.googlecode.mgwt.ui.client.widget.celllist.Cell;
import com.propertycross.mgwt.properties.Property;
import com.propertycross.mgwt.view.listitem.ListItem;
import com.propertycross.mgwt.view.listitem.LoadMoreIndicator;
import com.propertycross.mgwt.view.listitem.PropertyContainer;

public class SearchResultsListItemCell implements Cell<ListItem>{

	private static final PropertyItemTemplate PROPERTY_ITEM_TEMPLATE = GWT.create(PropertyItemTemplate.class);
  public interface PropertyItemTemplate extends SafeHtmlTemplates {
      @SafeHtmlTemplates.Template("<div class='propertyListItem'><div class='thumbnail-container'><img src=\"{0}\" /></div>" +
          "<h3>{1}</h3><p>{2}</p></span></div>"
      )
      SafeHtml content(SafeUri imgUrl, String price, String title);
  }
  
  private static final LoadMoreItemTemplate LOAD_MORE_ITEM_TEMPLATE = GWT.create(LoadMoreItemTemplate.class);
  public interface LoadMoreItemTemplate extends SafeHtmlTemplates {
      @SafeHtmlTemplates.Template("<div class='propertyListItem'><h3>Load More ...</h3>" +
  "<p>Results for <b>{0}</b>, showing <b>{1}</b> of <b>{2}</b> properties</div>"
      )
      SafeHtml content(String location, int displayedProperties, int totalProperties);
  }
  
	@Override
  public void render(SafeHtmlBuilder safeHtmlBuilder, ListItem listItem) {
		
		if (listItem instanceof PropertyContainer) {
			PropertyContainer container = (PropertyContainer)listItem;
			Property model = container.getProperty();			
			safeHtmlBuilder.append(PROPERTY_ITEM_TEMPLATE.content(model.imgUrl(),
					model.formattedPrice(), model.title()));
		} else if (listItem instanceof LoadMoreIndicator) {
			LoadMoreIndicator loadMore = (LoadMoreIndicator)listItem;
			safeHtmlBuilder.append(LOAD_MORE_ITEM_TEMPLATE.content(loadMore.getSearchString(),
					loadMore.getDisplayedProperties(), loadMore.getTotalProperties()));
		}
  }

	@Override
  public boolean canBeSelected(ListItem model) {
	  // TODO Auto-generated method stub
	  return false;
  }

}
