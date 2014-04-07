/**
 * @private
 */
Ext.define('Ext.behavior.Scrollable', {

    extend: 'Ext.behavior.Behavior',

    requires: [
        'Ext.scroll.View'
    ],

    constructor: function() {
        this.listeners = {
            painted: 'onComponentPainted',
            scope: this
        };

        this.callParent(arguments);
    },

    onComponentPainted: function() {
        this.scrollView.refresh();
    },

    setConfig: function(config) {
        var scrollView = this.scrollView,
            component = this.component,
            scrollerElement, extraWrap, scroller, direction;

        if (config) {
            if (!scrollView) {
                this.scrollView = scrollView = new Ext.scroll.View(config);
                scrollView.on('destroy', 'onScrollViewDestroy', this);

                component.setUseBodyElement(true);

                this.scrollerElement = scrollerElement = component.innerElement;

                if (!Ext.feature.has.ProperHBoxStretching) {
                    scroller = scrollView.getScroller();
                    direction = (Ext.isObject(config) ? config.direction : config) || 'auto';

                    if (direction !== 'vertical') {
                        extraWrap = scrollerElement.wrap();
                        extraWrap.addCls(Ext.baseCSSPrefix + 'translatable-hboxfix');
                        if (direction == 'horizontal') {
                            extraWrap.setStyle({height: '100%'});
                        }
                        this.scrollContainer = extraWrap.wrap();
                        scrollView.FixedHBoxStretching = scroller.FixedHBoxStretching = true;
                    }
                    else {
                        this.scrollContainer = scrollerElement.wrap();
                    }
                }
                else {
                    this.scrollContainer = scrollerElement.wrap();
                }

                scrollView.setElement(component.bodyElement);

                if (component.isPainted()) {
                    this.onComponentPainted();
                }

                component.on(this.listeners);
            }
            else if (Ext.isString(config) || Ext.isObject(config)) {
                scrollView.setConfig(config);
            }
        }
        else if (scrollView) {
            scrollView.destroy();
        }

        return this;
    },

    getScrollView: function() {
        return this.scrollView;
    },

    onScrollViewDestroy: function() {
        var component = this.component,
            scrollerElement = this.scrollerElement;

        if (!scrollerElement.isDestroyed) {
            this.scrollerElement.unwrap();
        }

        this.scrollContainer.destroy();

        if (!component.isDestroyed) {
            component.un(this.listeners);
        }

        delete this.scrollerElement;
        delete this.scrollView;
        delete this.scrollContainer;
    },

    onComponentDestroy: function() {
        var scrollView = this.scrollView;

        if (scrollView) {
            scrollView.destroy();
        }
    }
});
