package com.propertycross.neomad.adapter.holder;

import com.neomades.ui.TextLabel;
import com.neomades.ui.View;
import com.propertycross.neomad.Res;
import com.propertycross.neomad.utils.Fonts;

/**
 * @author Neomades
 */
public class LoadMoreView implements ViewHolder {
	private TextLabel loading;
	private TextLabel message;

	public void update(Object model) {
		message.setText(model.toString());
		loading.setText(Res.string.LOADING);
		message.setFont(Fonts.DEFAULT_PLAIN_XSMALL);
		loading.setFont(Fonts.DEFAULT_BOLD_XSMALL);
		strop();
	}

	public View getView() {
		View view = View.inflateXML(Res.layout.PROPERTY_SEARCH_FOOTER);
		view.setTag(this);
		loading = (TextLabel) view.findView(Res.id.ITEM_FOOTER_LOADING);
		message = (TextLabel) view.findView(Res.id.ITEM_FOOTER_MESSAGE);
		return view;
	}

	public void start() {
		loading.setVisible(true);
		message.setVisible(false);
	}

	public void strop() {
		loading.setVisible(false);
		message.setVisible(true);
	}
}
