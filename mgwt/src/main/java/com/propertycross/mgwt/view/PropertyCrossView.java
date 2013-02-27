package com.propertycross.mgwt.view;

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
import com.googlecode.mgwt.ui.client.widget.MSearchBox;

import com.propertycross.mgwt.activity.PropertyCrossActivity;
import com.propertycross.mgwt.activity.PropertyCrossActivity.ViewEventHandler;

public class PropertyCrossView extends Composite implements PropertyCrossActivity.View {

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

	public PropertyCrossView() {
		initWidget(uiBinder.createAndBindUi(this));
		
		setLoadingIndicatorVisible(false);

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

}
