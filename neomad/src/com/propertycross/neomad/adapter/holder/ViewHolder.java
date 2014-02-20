package com.propertycross.neomad.adapter.holder;

import com.neomades.ui.View;

/**
 * @author Neomades
 */
public interface ViewHolder {
	
	/**
	 * @param model
	 */
	void update(Object model);

	/**
	 * @return
	 */
	View getView();
}
