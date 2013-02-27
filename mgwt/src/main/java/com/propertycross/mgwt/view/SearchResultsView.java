package com.propertycross.mgwt.view;

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

import com.propertycross.mgwt.activity.SearchResultsActivity;
import com.propertycross.mgwt.activity.SearchResultsActivity.ViewEventHandler;

public class SearchResultsView extends Composite implements SearchResultsActivity.View {

	private static SearchResultsViewUiBinder uiBinder = GWT.create(SearchResultsViewUiBinder.class);

	interface SearchResultsViewUiBinder extends UiBinder<Widget, SearchResultsView> {
	}

	public SearchResultsView() {
		initWidget(uiBinder.createAndBindUi(this));
	}

	public SearchResultsView(String firstName) {
		initWidget(uiBinder.createAndBindUi(this));
		
	}

	@Override
  public void setEventHandler(ViewEventHandler eventHandler) {
	  // TODO Auto-generated method stub
	  
  }

}
