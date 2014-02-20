package com.propertycross.neomad.screen;

import java.io.InputStream;

import com.neomades.app.ResManager;
import com.neomades.graphics.Image;
import com.neomades.graphics.ScaleType;
import com.neomades.io.file.File;
import com.neomades.io.file.FileInputStream;
import com.neomades.io.file.FileStorage;
import com.neomades.io.http.HttpListener;
import com.neomades.io.http.HttpRequest;
import com.neomades.io.http.HttpResponse;
import com.neomades.ui.ImageLabel;
import com.neomades.ui.StretchMode;
import com.neomades.ui.TextLabel;
import com.neomades.ui.menu.Menu;
import com.neomades.ui.menu.MenuItem;
import com.propertycross.neomad.Constants;
import com.propertycross.neomad.Res;
import com.propertycross.neomad.adapter.screen.PropertyDetailAdapter;
import com.propertycross.neomad.event.Event;
import com.propertycross.neomad.model.Property;
import com.propertycross.neomad.utils.Fonts;
import com.propertycross.neomad.utils.Log;
import com.propertycross.neomad.utils.StreamUtils;

/**
 * @author Neomades
 */
public class PropertyDetail extends PropertyDetailAdapter {

	private MenuItem favouritesMenuItem;

	protected void onCreate() {
		setContent(Res.layout.PROPERTY_DETAIL_VIEW);
		setTitle(Res.string.PROPERTY_DETAILS);
		init();
		
		TextLabel price = (TextLabel) findView(Res.id.ITEM_DETAIL_PRICE);
		price.setText(getProperty().getFormattedPrice());
		price.setFont(Fonts.DEFAULT_PLAIN_LARGE);
		
		TextLabel location = (TextLabel) findView(Res.id.ITEM_DETAIL_LOCATION);
		location.setText(getProperty().getShortTitle());
		location.setFont(Fonts.DEFAULT_PLAIN_SMALL);
		if (Constants.PROPERTY_DETAILS_SUBTITLE) {
			location.setText(getProperty().getShortTitle());
			location.setFont(Fonts.DEFAULT_PLAIN_SMALL);
		} else {
			location.setVisible(false);
			setTitleFont(Fonts.DEFAULT_PLAIN_LARGE);
			setTitle(getProperty().getShortTitle());
		}
		
		
		ImageLabel image = (ImageLabel) findView(Res.id.ITEM_DETAIL_IMAGE);
		setImage(getProperty(), image);
		image.setStretchMode(StretchMode.MATCH_PARENT, StretchMode.MATCH_PARENT);
		image.setImageScaleType(ScaleType.SCALE_ASPECT_FIT);
		image.setDrawingCacheEnabled(true);
		
		TextLabel title = (TextLabel) findView(Res.id.ITEM_DETAIL_TITLE);
		title.setText(getProperty().getBedBathroomText());
		title.setFont(Fonts.DEFAULT_PLAIN_SMALL);
		
		TextLabel desc = (TextLabel) findView(Res.id.ITEM_DETAIL_DESC);
		desc.setText(getProperty().getSummary());
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
		send(new Event(null, getName(), PropertyFavourites.SERVICE_NAME,
				Event.Type.UPDATE_LIST));
		favouritesMenuItem.setImage(getFavicon());
	}

	private Image getFavicon() {
		return ResManager.getImage(isFavorite() ? Res.image.STAR
				: Res.image.NO_STAR);
	}

	private void setImage(Property model, final ImageLabel image) {
		File cache = new File(FileStorage.getPrivateDir(), "images");
		if (!cache.exists()) {
			cache.mkdirs();
		}
		final File file = new File(cache, model.getGuid() + "_big");
		try {
			if (file.exists()) {
				image.setImage(Image.createImage(new FileInputStream(file)));
			} else {
				image.setImage(null);
				asyncLoadImage(model, image, file);
			}
		} catch (Exception ex) {
			Log.d(ex.getMessage());
		}
	}

	private void asyncLoadImage(Property model, final ImageLabel image, final File file) {
		new HttpRequest(model.getImageUrl())
				.executeAsync(new HttpListener() {
					public void onHttpResponse(HttpRequest httpRequest,
							HttpResponse httpResponse) {
						
						if (httpResponse.isSuccess()) {
							final InputStream dataStream = httpResponse
									.getDataStream();
							controller.runOnUiThread(new Runnable() {
								public void run() {
									updateImage(image, file, dataStream);
								}
							});
						}
					}
				});
	}
	
	private void updateImage(final ImageLabel image, final File file,
			final InputStream dataStream) {
		try {
			StreamUtils.copy(dataStream,
					file);
			image.setImage(Image
					.createImage(new FileInputStream(
							file)));
		} catch (Exception ex) {
			Log.d(ex.getMessage());
		}
	}
}
