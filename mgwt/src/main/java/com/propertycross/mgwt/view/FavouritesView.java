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
import com.propertycross.mgwt.activity.FavouritesActivity;
import com.propertycross.mgwt.activity.FavouritesActivity.ViewEventHandler;
import com.propertycross.mgwt.page.PageBase;
import com.propertycross.mgwt.properties.Property;
import com.propertycross.mgwt.view.listitem.ListItem;
import com.propertycross.mgwt.view.listitem.PropertyContainer;

public class FavouritesView extends ViewBase implements FavouritesActivity.View{

	private final SearchResultsListItemCell cell = new SearchResultsListItemCell();
	
	private ArrayList<ListItem> listItems;
	
	private ViewEventHandler eventHandler;
	
	private static FavouritesViewUiBinder uiBinder = GWT.create(FavouritesViewUiBinder.class);

	interface FavouritesViewUiBinder extends UiBinder<Widget, FavouritesView> {
	}

	public FavouritesView(PageBase pageBase) {
		super(pageBase);
		initWidget(uiBinder.createAndBindUi(this));
		
		cellList.addCellSelectedHandler(new CellSelectedHandler() {
      @Override
      public void onCellSelected(CellSelectedEvent event) {
      	ListItem listItem = listItems.get(event.getIndex());
      	if (listItem instanceof PropertyContainer) {
      		eventHandler.propertySelected(((PropertyContainer)listItem).getProperty());
      	}
      }
    });
	}
	
	@UiField(provided = true)
	CellList<ListItem> cellList = new CellList<ListItem>(cell);

	@Override
  public void setEventHandler(ViewEventHandler eventHandler) {
	  this.eventHandler = eventHandler;
  }

	@Override
  public void setFavourites(List<Property> properties) {
		listItems = new ArrayList<ListItem>();
		for(Property property : properties) {
			listItems.add(new PropertyContainer(property));
		}
	  cellList.render(listItems);
  }

}
