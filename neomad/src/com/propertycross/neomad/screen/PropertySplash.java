package com.propertycross.neomad.screen;

import java.util.Timer;
import java.util.TimerTask;

import com.propertycross.neomad.Res;
import com.propertycross.neomad.adapter.screen.ScreenAdapter;

public class PropertySplash extends ScreenAdapter {

	public static final String SERVICE_NAME = "PropertySplash";
	private static final int SECONDS = 1000;

	public String getName() {
		return SERVICE_NAME;
	}

	protected void update() {
	}

	private void showPropertyFinderScreen() {
		controller.resetScreenStack(PropertyFinder.class, getScreenParams());
	}

	protected void onCreate() {
		setContent(Res.layout.PROPERTY_SPLASH);
		new Timer().schedule(new TimerTask() {
			public void run() {
				showPropertyFinderScreen();
			}

		}, 2 * SECONDS);
	}

}
