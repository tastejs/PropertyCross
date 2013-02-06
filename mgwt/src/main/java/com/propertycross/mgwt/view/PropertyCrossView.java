package com.propertycross.mgwt.view;

import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.Style.Display;
import com.google.gwt.event.dom.client.KeyUpEvent;
import com.google.gwt.event.dom.client.KeyUpHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.googlecode.mgwt.dom.client.event.tap.TapEvent;
import com.googlecode.mgwt.dom.client.event.tap.TapHandler;
import com.googlecode.mgwt.ui.client.widget.Button;
import com.googlecode.mgwt.ui.client.widget.CellList;
import com.googlecode.mgwt.ui.client.widget.MSearchBox;
import com.googlecode.mgwt.ui.client.widget.celllist.CellSelectedEvent;
import com.googlecode.mgwt.ui.client.widget.celllist.CellSelectedHandler;
import com.propertycross.mgwt.activity.PropertyCrossActivity;
import com.propertycross.mgwt.activity.PropertyCrossActivity.ViewEventHandler;
import com.propertycross.mgwt.locations.Location;
import com.propertycross.mgwt.locations.Search;
import com.propertycross.mgwt.page.PageBase;

public class PropertyCrossView extends ViewBase implements PropertyCrossActivity.View {

	private final LocationCell locationCell = new LocationCell();
	
	private final RecentSearchCell recentSearchCell = new RecentSearchCell();
	
	private List<Location> locations;
	
	private List<Search> recentSearches;
	
	private static PropertyCrossViewUiBinder uiBinder = GWT.create(PropertyCrossViewUiBinder.class);

	interface PropertyCrossViewUiBinder extends UiBinder<HTMLPanel, PropertyCrossView> {
	}

	private ViewEventHandler eventHandler;

	@UiField
	Button goButton;
	@UiField
	Button myLocationButton;
	@UiField
	MSearchBox searchTextField;
	@UiField
	Element userMessage;
	@UiField
	Element isLoadingIndicator;
	@UiField(provided = true)
	CellList<Location> suggestedLocationsList = new CellList<Location>(locationCell);
	@UiField(provided = true)
	CellList<Search> recentSearchesList = new CellList<Search>(recentSearchCell);
	@UiField
	Element recentSearchesHeader;
	@UiField
	Element suggestedLocationsHeading;	

	public PropertyCrossView(PageBase pageBase) {
		super(pageBase);
		initWidget(uiBinder.createAndBindUi(this));
		
		goButton.getElement().getStyle().setDisplay(Display.INLINE_BLOCK);
		myLocationButton.getElement().getStyle().setDisplay(Display.INLINE_BLOCK);
		
		showElement(isLoadingIndicator, false);
		showElement(suggestedLocationsHeading, false);
		showElement(recentSearchesHeader, false);
		showElement(userMessage, false);
		
		suggestedLocationsList.addCellSelectedHandler(new CellSelectedHandler() {
      @Override
      public void onCellSelected(CellSelectedEvent event) {
        eventHandler.locationSelected(locations.get(event.getIndex()));
      }
    });
		
		recentSearchesList.addCellSelectedHandler(new CellSelectedHandler() {
      @Override
      public void onCellSelected(CellSelectedEvent event) {
        eventHandler.recentSearchSelected(recentSearches.get(event.getIndex()));
      }
    });

		goButton.addTapHandler(new TapHandler() {
			@Override
			public void onTap(TapEvent event) {
				eventHandler.searchButtonClicked();
			}
		});

		myLocationButton.addTapHandler(new TapHandler() {
			@Override
			public void onTap(TapEvent event) {
				eventHandler.myLocationButtonClicked();
			}
		});

		searchTextField.addKeyUpHandler(new KeyUpHandler() {
			@Override
			public void onKeyUp(KeyUpEvent event) {
				eventHandler.searchTextChanged(searchTextField.getText());
			}
		});

		searchTextField.addValueChangeHandler(new ValueChangeHandler<String>() {
			@Override
			public void onValueChange(ValueChangeEvent<String> e) {
				eventHandler.searchButtonClicked();
			}
		});
	}
	
	private void showElement(Element element, boolean show)
	{
		element.getStyle().setDisplay(show ? Display.BLOCK : Display.NONE);
	}
	
	@Override
	public void setEventHandler(final ViewEventHandler eventHandler) {
		this.eventHandler = eventHandler;
	}

	@Override
	public void setMessage(String message) {
		userMessage.setInnerHTML(message);
	}

	@Override
  public void setIsLoading(boolean isLoading) {
		showElement(isLoadingIndicator, false);
  }

	@Override
  public void displaySuggestedLocations(List<Location> locations) {
		if (locations == null) {
			suggestedLocationsList.setVisible(false);
			showElement(suggestedLocationsHeading, false);
		}	else {
			suggestedLocationsList.setVisible(true);
			showElement(suggestedLocationsHeading, true);
			this.locations = locations;
			suggestedLocationsList.render(locations);			
		}
		updateScrollingHost();
  }

	@Override
  public void displayRecentSearches(List<Search> recentSearches) {
		if (recentSearches == null || recentSearches.size() == 0) {
			recentSearchesList.setVisible(false);
			recentSearchesHeader.getStyle().setDisplay(Display.NONE);
		} else {
			recentSearchesList.setVisible(true);
			recentSearchesHeader.getStyle().setDisplay(Display.BLOCK);
			this.recentSearches = recentSearches;
		  recentSearchesList.render(recentSearches);
		}
		updateScrollingHost();
  }

	@Override
  public void setSearchText(String searchText) {
		searchTextField.setText(searchText); 
  }

	@Override
	public void favouriteClicked() {
	  eventHandler.favouritesClicked();
	}
}
