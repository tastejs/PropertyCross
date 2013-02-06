package com.propertycross.mgwt.view;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Widget;
import com.googlecode.mgwt.ui.client.widget.CellList;
import com.googlecode.mgwt.ui.client.widget.celllist.CellSelectedEvent;
import com.googlecode.mgwt.ui.client.widget.celllist.CellSelectedHandler;
import com.propertycross.mgwt.activity.SearchResultsActivity;
import com.propertycross.mgwt.activity.SearchResultsActivity.ViewEventHandler;
import com.propertycross.mgwt.page.PageBase;
import com.propertycross.mgwt.properties.Property;
import com.propertycross.mgwt.view.listitem.ListItem;
import com.propertycross.mgwt.view.listitem.LoadMoreIndicator;
import com.propertycross.mgwt.view.listitem.PropertyContainer;

public class SearchResultsView extends ViewBase implements SearchResultsActivity.View {
	
	private final SearchResultsListItemCell cell = new SearchResultsListItemCell();
	
	private ViewEventHandler eventHandler;
	
	private List<ListItem> listItems;


	private static SearchResultsViewUiBinder uiBinder = GWT.create(SearchResultsViewUiBinder.class);

	interface SearchResultsViewUiBinder extends UiBinder<Widget, SearchResultsView> {
	}
	
	@UiField(provided = true)
	CellList<ListItem> cellList = new CellList<ListItem>(cell);

	public SearchResultsView(PageBase pageBase) {
		super(pageBase);
		initWidget(uiBinder.createAndBindUi(this));
		
		cellList.addCellSelectedHandler(new CellSelectedHandler() {
      @Override
      public void onCellSelected(CellSelectedEvent event) {
      	ListItem listItem = listItems.get(event.getIndex());
      	if (listItem instanceof PropertyContainer) {
      		eventHandler.propertySelected(((PropertyContainer)listItem).getProperty());
      	}
      	if (listItem instanceof LoadMoreIndicator) {
      		eventHandler.loadMoreClicked();
      	}
      }
    });
	}


	@Override
  public void setEventHandler(ViewEventHandler eventHandler) {
	  this.eventHandler = eventHandler;
  }

	@Override
  public void setSearchResult(int totalResult, int pageNumber, int totalPages, List<Property> properties,
      String searchLocation) {

		listItems = new ArrayList<ListItem>();
		for(Property property : properties) {
			listItems.add(new PropertyContainer(property));
		}
		listItems.add(new LoadMoreIndicator(properties.size(), totalResult, searchLocation));
		cellList.render(listItems);	
		pageBase.setTitle(Integer.toString(properties.size()) + " of " + Integer.toString(totalResult) + " matches");
		updateScrollingHost();
  }


	@Override
  public void setLoadMoreVisible(boolean visible) {
	  // TODO Auto-generated method stub
	  
  }

}
