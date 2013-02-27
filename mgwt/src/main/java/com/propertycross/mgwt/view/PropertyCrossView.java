package com.propertycross.mgwt.view;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.Style.Display;
import com.google.gwt.event.dom.client.KeyUpEvent;
import com.google.gwt.event.dom.client.KeyUpHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
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
import com.propertycross.mgwt.properties.Property;

public class PropertyCrossView extends Composite implements PropertyCrossActivity.View {

	private final LocationCell cell = new LocationCell();
	
	private List<Location> locations;
	
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
	CellList<Location> cellList = new CellList<Location>(cell);

	public PropertyCrossView() {
		initWidget(uiBinder.createAndBindUi(this));
		
		setLoadingIndicatorVisible(false);
		
		cellList.addCellSelectedHandler(new CellSelectedHandler() {
      @Override
      public void onCellSelected(CellSelectedEvent event) {
        Location location = locations.get(event.getIndex());
        eventHandler.locationSelected(location);
      }
    });

		goButton.addTapHandler(new TapHandler() {
			@Override
			public void onTap(TapEvent event) {
				eventHandler.searchButtonClicked();
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
	
	private void setLoadingIndicatorVisible(boolean visible)
	{
		isLoadingIndicator.getStyle().setDisplay(visible ? Display.BLOCK : Display.NONE);
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
		setLoadingIndicatorVisible(isLoading);
  }

	@Override
  public void displaySuggestedLocations(List<Location> locations) {
		this.locations = locations;
		cellList.render(locations);
  }

}
