package com.propertycross.mgwt.view;

import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HasText;
import com.google.gwt.user.client.ui.Widget;
import com.googlecode.mgwt.ui.client.widget.CellList;
import com.googlecode.mgwt.ui.client.widget.celllist.CellSelectedEvent;
import com.googlecode.mgwt.ui.client.widget.celllist.CellSelectedHandler;

import com.propertycross.mgwt.activity.SearchResultsActivity;
import com.propertycross.mgwt.activity.SearchResultsActivity.ViewEventHandler;
import com.propertycross.mgwt.properties.Property;

public class SearchResultsView extends Composite implements SearchResultsActivity.View {
	
	private final PropertyCell cell = new PropertyCell();
	
	private ViewEventHandler eventHandler;
	
	private List<Property> properties;

	private static SearchResultsViewUiBinder uiBinder = GWT.create(SearchResultsViewUiBinder.class);

	interface SearchResultsViewUiBinder extends UiBinder<Widget, SearchResultsView> {
	}
	
	@UiField(provided = true)
	CellList<Property> cellList = new CellList<Property>(cell);

	public SearchResultsView() {
		initWidget(uiBinder.createAndBindUi(this));
		
		cellList.addCellSelectedHandler(new CellSelectedHandler() {
      @Override
      public void onCellSelected(CellSelectedEvent event) {
        Property property = properties.get(event.getIndex());
        eventHandler.propertySelected(property);
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

		this.properties = properties;
		cellList.render(properties);
  }

}
