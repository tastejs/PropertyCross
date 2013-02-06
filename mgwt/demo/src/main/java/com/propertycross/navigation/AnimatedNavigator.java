package com.propertycross.navigation;

import com.googlecode.mgwt.mvp.client.Animation;
import com.googlecode.mgwt.ui.client.animation.AnimationHelper;
import com.googlecode.mgwt.ui.client.widget.LayoutPanel;

public final class AnimatedNavigator implements Navigator {

    private final AnimationHelper helper;
    private final Animation animation;

    public AnimatedNavigator(AnimationHelper helper, Animation animation)
    {
        this.helper = helper;
        this.animation = animation;
    }

    @Override
    public void goTo(Navigable n)
    {
        LayoutPanel p = new LayoutPanel();
        n.addTo(p);
        helper.goTo(p, animation);
    }

}
