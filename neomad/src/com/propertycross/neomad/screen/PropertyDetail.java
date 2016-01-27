package com.propertycross.neomad.screen;

import com.neomades.app.Application;
import com.neomades.app.ResManager;
import com.neomades.content.image.FileImageCache;
import com.neomades.content.image.ImageLoader;
import com.neomades.content.image.ImageUrlLabel;
import com.neomades.graphics.Image;
import com.neomades.graphics.ScaleType;
import com.neomades.io.file.File;
import com.neomades.ui.StretchMode;
import com.neomades.ui.TextLabel;
import com.neomades.ui.menu.Menu;
import com.neomades.ui.menu.MenuItem;
import com.propertycross.neomad.Constants;
import com.propertycross.neomad.PropertyCross;
import com.propertycross.neomad.Res;
import com.propertycross.neomad.model.PersistenceState;
import com.propertycross.neomad.model.Property;
import com.propertycross.neomad.screen.adapter.screen.ScreenAdapter;
import com.propertycross.neomad.services.PersistenceStateEvent;
import com.propertycross.neomad.utils.Fonts;

/**
 * @author Neomades
 */
public class PropertyDetail extends ScreenAdapter {

	
	private Property property;

	private MenuItem favouritesMenuItem;
	
	private static ImageLoader loader = new ImageLoader(new FileImageCache(new File(PropertyCross.getAppCacheDir(), Constants.PROPERTIES_IMAGES_CACHE)));

	protected void onCreate() {
		//this.registerEvent(Constants.LOAD_COMPLETE);
		
		setContent(Res.layout.PROPERTY_DETAIL_VIEW);
		setTitle(Res.string.PROPERTY_DETAILS);
		init();
		
		TextLabel price = (TextLabel) findView(Res.id.ITEM_DETAIL_PRICE);
		price.setText(property.getFormattedPrice());
		price.setFont(Fonts.DEFAULT_PLAIN_LARGE);
		
		TextLabel location = (TextLabel) findView(Res.id.ITEM_DETAIL_LOCATION);
		location.setText(property.getShortTitle());
		location.setFont(Fonts.DEFAULT_PLAIN_SMALL);
		if (Constants.PROPERTY_DETAILS_SUBTITLE) {
			location.setText(property.getShortTitle());
			location.setFont(Fonts.DEFAULT_PLAIN_SMALL);
		} else {
			location.setVisible(false);
			setTitleFont(Fonts.DEFAULT_PLAIN_LARGE);
			setTitle(property.getShortTitle());
		}
		
		
		ImageUrlLabel image = (ImageUrlLabel) findView(Res.id.ITEM_DETAIL_IMAGE);
		image.setImageUrl(property.getImageUrl(), loader);
		image.setStretchMode(StretchMode.MATCH_PARENT, StretchMode.MATCH_PARENT);
		image.setImageScaleType(ScaleType.SCALE_ASPECT_FIT);
		image.setDrawingCacheEnabled(true);
		
		TextLabel title = (TextLabel) findView(Res.id.ITEM_DETAIL_TITLE);
		title.setText(property.getBedBathroomText());
		title.setFont(Fonts.DEFAULT_PLAIN_SMALL);
		
		TextLabel desc = (TextLabel) findView(Res.id.ITEM_DETAIL_DESC);
		desc.setText(property.getSummary());
	}
	
	protected void init() {
		super.init();
		property = (Property) getScreenParams().getObject(
				Property.class.getName());
	}

	protected void onMenuCreate(Menu menu) {
		if (Constants.FAVOURITES_SHORT_TEXT) {
			favouritesMenuItem = new MenuItem(getFavicon());
		} else {
			favouritesMenuItem = new MenuItem(ResManager.getString(Res.string.FAVOURITES), getFavicon());	
		}
		favouritesMenuItem.setAsRightAction();
		menu.addItem(favouritesMenuItem);
	}

	protected void onMenuAction(MenuItem menuItem) {
		toggleFavorite();
		Application.getCurrent().getEventBus().send(new PersistenceStateEvent(this, this, Constants.UPDATE_FAVORITES));
		favouritesMenuItem.setImage(getFavicon());
	}

	private void toggleFavorite() {
		PersistenceState.getInstance().persist(property);
	}
	
	private boolean isFavorite() {
		return PersistenceState.getInstance().isFavorite(property);
	}
	
	private Image getFavicon() {
		return ResManager.getImage(isFavorite() ? Res.image.STAR
				: Res.image.NO_STAR);
	}

	protected void update() {
		
	}
}
