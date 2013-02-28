package com.propertycross.mgwt.view;

import com.google.gwt.user.client.ui.Composite;
import com.propertycross.mgwt.page.PageBase;

public abstract class ViewBase extends Composite {

	private final PageBase pageBase;

	public ViewBase(PageBase pageBase) {
	  super();
	  this.pageBase = pageBase;
  }
	
	protected void updateScrollingHost() {
		pageBase.updateScrollingHost();
	}
}
