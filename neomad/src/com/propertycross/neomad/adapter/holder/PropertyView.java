package com.propertycross.neomad.adapter.holder;

import java.io.InputStream;

import com.neomades.graphics.Image;
import com.neomades.io.file.File;
import com.neomades.io.file.FileInputStream;
import com.neomades.io.file.FileStorage;
import com.neomades.io.http.HttpListener;
import com.neomades.io.http.HttpRequest;
import com.neomades.io.http.HttpResponse;
import com.neomades.ui.ImageLabel;
import com.neomades.ui.TextLabel;
import com.neomades.ui.View;
import com.propertycross.neomad.Res;
import com.propertycross.neomad.adapter.AsyncTask;
import com.propertycross.neomad.adapter.screen.ScreenAdapter;
import com.propertycross.neomad.model.Property;
import com.propertycross.neomad.utils.Fonts;
import com.propertycross.neomad.utils.Log;
import com.propertycross.neomad.utils.StreamUtils;

/**
 * @author Neomades
 */
public class PropertyView implements ViewHolder {

	private ImageLabel image;
	private TextLabel price;
	private TextLabel desc;
	private ScreenAdapter screen;

	public PropertyView(ScreenAdapter screen) {
		this.screen = screen;
	}

	public void update(final Object model) {
		price.setText(((Property) model).getFormattedPrice());
		price.setFont(Fonts.DEFAULT_PLAIN_THIN);
		desc.setText(((Property) model).getShortTitle());
		desc.setFont(Fonts.DEFAULT_PLAIN_XSMALL);
		setImage((Property) model);
		image.setDrawingCacheEnabled(true);
	}

	public View getView() {
		View view = View.inflateXML(Res.layout.PROPERTY_SEARCH_ROW);
		view.setTag(this);
		image = (ImageLabel) view.findView(Res.id.ITEM_IMAGE);
		price = (TextLabel) view.findView(Res.id.ITEM_PRICE);
		desc = (TextLabel) view.findView(Res.id.ITEM_DESC);
		return view;
	}

	private void setImage(Property model) {
		File cache = new File(FileStorage.getPrivateDir(), "images");
		if (!cache.exists()) {
			cache.mkdirs();
		}
		final File file = new File(cache, model.getGuid() + "_small");
		try {
			if (file.exists()) {
				image.setImage(Image.createImage(new FileInputStream(file)));
			} else {
				image.setImage(null);
				new HttpRequest(model.getThumbnailUrl()).executeAsync(new HttpListener() {
					public void onHttpResponse(HttpRequest httpRequest, HttpResponse httpResponse) {
						if (httpResponse.isSuccess()) {
							InputStream dataStream = httpResponse.getDataStream();
							updateImage(file, dataStream);
						}
					}

				});
			}
		} catch (Exception ex) {
			Log.d(ex.getMessage());
		}
	}

	private void updateImage(final File file, final InputStream dataStream) {
		screen.runAsync(new AsyncTask() {
			public void run() {
				try {
					StreamUtils.copy(dataStream, file);
					image.setImage(Image.createImage(new FileInputStream(file)));
				} catch (Exception ex) {
					Log.d(ex.getMessage());
				}
			}
		});
	}
}
