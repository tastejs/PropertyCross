package com.propertycross.mgwt.view;

import com.google.gwt.core.client.GWT;
import com.google.gwt.safehtml.client.SafeHtmlTemplates;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlBuilder;
import com.google.gwt.safehtml.shared.SafeUri;
import com.googlecode.mgwt.ui.client.widget.celllist.Cell;
import com.propertycross.mgwt.properties.Property;

public class SearchResultsListItemCell implements Cell<SearchResultsView.ListItem>{

	private static final PropertyItemTemplate PROPERTY_ITEM_TEMPLATE = GWT.create(PropertyItemTemplate.class);
  public interface PropertyItemTemplate extends SafeHtmlTemplates {
      @SafeHtmlTemplates.Template("<img src=\"{0}\" />" +
          "<span><div>{1}</div><div>{2}</div></span>"
      )
      SafeHtml content(SafeUri imgUrl, String price, String summary);
  }
  
  private static final LoadMoreItemTemplate LOAD_MORE_ITEM_TEMPLATE = GWT.create(LoadMoreItemTemplate.class);
  public interface LoadMoreItemTemplate extends SafeHtmlTemplates {
      @SafeHtmlTemplates.Template("<h3>Load More ...</h3>" +
  "<p>Results for {0}, showing <span>{1}</span> of <span>{2}</span> properties"
      )
      SafeHtml content(String location, int displayedProperties, int totalProperties);
  }
  
	@Override
  public void render(SafeHtmlBuilder safeHtmlBuilder, SearchResultsView.ListItem listItem) {
		
		if (listItem instanceof SearchResultsView.PropertyContainer) {
			SearchResultsView.PropertyContainer container = (SearchResultsView.PropertyContainer)listItem;
			Property model = container.getProperty();			
			safeHtmlBuilder.append(PROPERTY_ITEM_TEMPLATE.content(model.imgUrl(),
					model.formattedPrice(), model.summary()));
		} else if (listItem instanceof SearchResultsView.LoadMoreIndicator) {
			SearchResultsView.LoadMoreIndicator loadMore = (SearchResultsView.LoadMoreIndicator)listItem;
			safeHtmlBuilder.append(LOAD_MORE_ITEM_TEMPLATE.content(loadMore.getSearchString(),
					loadMore.getDisplayedProperties(), loadMore.getTotalProperties()));
		}
  }

	@Override
  public boolean canBeSelected(SearchResultsView.ListItem model) {
	  // TODO Auto-generated method stub
	  return false;
  }

}
