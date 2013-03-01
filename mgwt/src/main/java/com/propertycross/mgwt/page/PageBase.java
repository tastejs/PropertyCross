package com.propertycross.mgwt.page;

import com.google.gwt.user.client.History;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.IsWidget;
import com.google.gwt.user.client.ui.Widget;
import com.googlecode.mgwt.dom.client.event.tap.TapEvent;
import com.googlecode.mgwt.dom.client.event.tap.TapHandler;
import com.googlecode.mgwt.ui.client.widget.HeaderButton;
import com.googlecode.mgwt.ui.client.widget.HeaderPanel;
import com.googlecode.mgwt.ui.client.widget.LayoutPanel;
import com.googlecode.mgwt.ui.client.widget.ScrollPanel;

/**
 * Copied from the m-gwt showcase app, this view provides a header plus a scrollpanel. Useful for building pages that
 * conform to a standard style
 * 
 * @author ceberhardt
 * 
 */
public abstract class PageBase implements IsWidget {

  protected LayoutPanel main;
  protected ScrollPanel scrollPanel;
  protected HeaderPanel headerPanel;
  protected HeaderButton headerBackButton;
  protected HTML title;

  public PageBase(boolean showBackButton, String titleText) {

	  main = new LayoutPanel();
	  scrollPanel = new ScrollPanel();
	  headerPanel = new HeaderPanel();
	  title = new HTML();
	  title.setHTML(titleText);	  
	  headerPanel.setCenterWidget(title);	  
	
	  headerBackButton = new HeaderButton();
	  headerBackButton.setBackButton(true);
	  headerBackButton.setText("Back");
	  
	  main.add(headerPanel);
	  main.add(scrollPanel);
	
	  if (showBackButton) {
	  	headerPanel.setLeftWidget(headerBackButton);
	  }
	
	  // handle back button clicks
	  headerBackButton.addTapHandler(new TapHandler() {
	    @Override
	    public void onTap(TapEvent event) {
	      History.back();
	    }
	  });
	
	  
  }

  @Override
  public Widget asWidget() {
    return main;
  }
  
  public void updateScrollingHost() {
  	scrollPanel.refresh();
  }
  
  public void setTitle(String titleText) {
  	title.setHTML(titleText);	
  }

  protected void addBodyContent(Widget content, boolean scrollX) {
 	  scrollPanel.add(content);
	  scrollPanel.setScrollingEnabledX(scrollX);
  }

}
