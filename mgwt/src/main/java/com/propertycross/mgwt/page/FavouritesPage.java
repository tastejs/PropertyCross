package com.propertycross.mgwt.page;

import com.propertycross.mgwt.view.FavouritesView;

public class FavouritesPage extends PageBase {

	private final FavouritesView view;

	public FavouritesPage() {
		super(true, false, "Favourites");
		view = new FavouritesView(this);
		addContent(view);
	}

	public FavouritesView getView() {
		return view;
	}

}
