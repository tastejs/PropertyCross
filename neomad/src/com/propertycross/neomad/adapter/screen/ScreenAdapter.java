package com.propertycross.neomad.adapter.screen;

import com.neomades.app.ResManager;
import com.neomades.app.Screen;
import com.neomades.graphics.Anchor;
import com.neomades.graphics.Background;
import com.neomades.graphics.Color;
import com.propertycross.neomad.Constants;
import com.propertycross.neomad.PropertyCross;
import com.propertycross.neomad.Res;
import com.propertycross.neomad.adapter.AsyncTask;
import com.propertycross.neomad.event.Event;
import com.propertycross.neomad.service.EventListener;
import com.propertycross.neomad.utils.Fonts;

/**
 * @author Neomades
 */
public abstract class ScreenAdapter extends Screen implements EventListener {

	protected static final String EXTRA_PREVIOUS_SCREEN = "EXTRA_PREVIOUS_SCREEN";

	public static final Background BACKGROUND = Background.createWithLinearGradient(Anchor.TOP, Anchor.BOTTOM
			| Anchor.HCENTER, Color.LIGHT_GRAY, Color.WHITE);
	private static EventListener bus;

	private String shortTitle;

	protected String getShortTitle() {
		return shortTitle;
	}

	protected void updateTitle(String title) {
		setTitleFont(Fonts.SCREEN_TITLE_FONT);
		setTitle(title);
	}

	protected void updateTitle(int title) {
		setTitleFont(Fonts.SCREEN_TITLE_FONT);
		setTitle(title);
	}

	protected void setShortTitle(int shortTitle) {
		setShortTitle(ResManager.getString(shortTitle));
	}

	protected void setShortTitle(String shortTitle) {
		this.shortTitle = shortTitle;
	}

	protected void init() {
		PropertyCross.getServicesManager().register(this);
		updateBackgroundScreen();
	}

	private void updateBackgroundScreen() {
		if (Constants.SCREEN_WITH_BACKGROUND) {
			getContent().setBackground(BACKGROUND);
		} else if (Constants.SCREEN_WITH_BG_IMAGE) {
			setBackgroundImage(Res.image.SCREEN_BG_IMAGE);
		}
	}

	public abstract String getName();

	private EventListener getBus() {
		if (bus == null) {
			bus = (EventListener) getScreenParams().getObject(EventListener.class.getName());
		}
		return bus;
	}

	protected void renameBackButton() {
		if (Constants.RENAME_BACK_BUTTON) {
			String previousScreen = getScreenParams().getString(EXTRA_PREVIOUS_SCREEN);
			if (previousScreen != null) {
				setBackButtonText(previousScreen);
			}
		}
	}

	public void send(Event e) {
		
		getBus().receive(e);
		willSendEvent();
	}
	
	protected void willSendEvent() {
	}
	
	protected void didReceivedEvent() {
	}

	public final void receive(Event e) {
		didReceivedEvent();
		onEventReceived(e);
	}

	protected void onEventReceived(Event e) {
		
	}

	protected abstract void update();

	public void runAsync(AsyncTask event) {
		controller.getRootController().runOnUiThread(event);
	}

	public boolean hasLazyLoading() {
		// by default no
		return false;
	}
	
	
}
