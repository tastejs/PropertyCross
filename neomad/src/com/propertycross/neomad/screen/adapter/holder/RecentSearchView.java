package com.propertycross.neomad.screen.adapter.holder;

import com.neomades.graphics.Font;
import com.neomades.ui.TextLabel;
import com.neomades.ui.View;
import com.propertycross.neomad.Constants;
import com.propertycross.neomad.Res;
import com.propertycross.neomad.model.search.RecentSearch;
import com.propertycross.neomad.utils.Fonts;

/**
 * @author Neomades
 */
public class RecentSearchView implements ViewHolder {
	private TextLabel label;
	private TextLabel count;

	public void update(Object model) {
		label.setText(((RecentSearch) model).getSearch().getLabel());
		int nb = ((RecentSearch) model).getCount();
		count.setText(decorateCount(nb));
		count.setVisible(nb > 0);
		
		

		Font font = Fonts.DEFAULT_PLAIN_XXSMALL;
		label.setFont(font);
		count.setFont(font);
	}

	private String decorateCount(int nb) {
		if (Constants.RECENT_SEARCH_COUNT_WITH_PARENTHESIS) {
			return "(" + nb + ")";	
		} else {
			return "" + nb;
		}
	}

	public View getView() {
		View view = View.inflateXML(Res.layout.PROPERTY_RECENT_ROW);
		view.setTag(this);
		label = (TextLabel) view.findView(Res.id.ITEM_RECENT_LABEL);
		count = (TextLabel) view.findView(Res.id.ITEM_RECENT_COUNT);
		return view;
	}
}
