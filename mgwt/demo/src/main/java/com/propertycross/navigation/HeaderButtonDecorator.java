package com.propertycross.navigation;

import com.google.gwt.user.client.ui.HasWidgets;
import com.googlecode.mgwt.ui.client.widget.HeaderButton;
import com.googlecode.mgwt.ui.client.widget.HeaderPanel;

public final class HeaderButtonDecorator implements Navigation {

    private final NavigationManager wrapped;
    private final NavDecorator forward;
    private final NavDecorator back;

    public HeaderButtonDecorator(Navigator forward, Navigator back)
    {
        this.forward = new NavDecorator(forward);
        this.back = new NavDecorator(back);
        wrapped = new NavigationManager(this.forward, this.back);
    }

    public void setCenterButton(HeaderButton btn)
    {
        forward.center = btn;
        back.center = btn;
    }

    public void setLeftButton(HeaderButton btn)
    {
        forward.left = btn;
        back.left = btn;
    }

    public void setRightButton(HeaderButton btn)
    {
        forward.right = btn;
        back.right = btn;
    }

    @Override
    public void goTo(Navigable n)
    {
        wrapped.goTo(n);
    }

    @Override
    public boolean hasHistory()
    {
        return wrapped.hasHistory();
    }

    @Override
    public void goBack()
    {
        wrapped.goBack();
    }

    private final class NavDecorator implements Navigator {

        private final Navigator wrapped;
        private HeaderButton left;
        private HeaderButton right;
        private HeaderButton center;

        public NavDecorator(Navigator wrapped)
        {
            this.wrapped = wrapped;
        }

        @Override
        public void goTo(final Navigable n)
        {
            wrapped.goTo(new Navigable() {

                @Override public void addTo(HasWidgets p)
                {
                    HeaderPanel btnPanel = new HeaderPanel();
                    if(left != null) btnPanel.setLeftWidget(left);
                    if(center != null) btnPanel.setCenterWidget(center);
                    if(right != null) btnPanel.setRightWidget(right);
                    p.add(btnPanel);

                    n.addTo(p);
                }

            });
        }

    }

}
