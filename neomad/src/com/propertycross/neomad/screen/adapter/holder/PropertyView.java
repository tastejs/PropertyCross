package com.propertycross.neomad.screen.adapter.holder;

import com.neomades.content.image.ImageLoader;
import com.neomades.content.image.ImageUrlLabel;
import com.neomades.ui.TextLabel;
import com.neomades.ui.View;
import com.propertycross.neomad.Res;
import com.propertycross.neomad.model.Property;
import com.propertycross.neomad.services.PropertyThumbnailImageCache;
import com.propertycross.neomad.utils.Fonts;

/**
 * @author Neomades
 */
public class PropertyView implements ViewHolder {

	private ImageUrlLabel image;
	private TextLabel price;
	private TextLabel desc;
	
	// Keep Last recent used images in memory cache
	private static ImageLoader loader = new ImageLoader(new PropertyThumbnailImageCache());

	public void update(final Object model) {
		price.setText(((Property) model).getFormattedPrice());
		price.setFont(Fonts.DEFAULT_PLAIN_THIN);
		desc.setText(((Property) model).getShortTitle());
		desc.setFont(Fonts.DEFAULT_PLAIN_XSMALL);
		image.setImageUrl(((Property) model).getThumbnailUrl(), loader);
		image.setDrawingCacheEnabled(true);
	}

	public View getView() {
		View view = View.inflateXML(Res.layout.PROPERTY_SEARCH_ROW);
		view.setTag(this);
		image = (ImageUrlLabel) view.findView(Res.id.ITEM_IMAGE);
		price = (TextLabel) view.findView(Res.id.ITEM_PRICE);
		desc = (TextLabel) view.findView(Res.id.ITEM_DESC);
		return view;
	}
}
