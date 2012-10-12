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
            scrollViewElement, scrollerElement;

        if (config) {
            if (!scrollView) {
                this.scrollView = scrollView = new Ext.scroll.View(config);
                scrollView.on('destroy', 'onScrollViewDestroy', this);

                component.setUseBodyElement(true);

                this.scrollerElement = scrollerElement = component.innerElement;
                this.scrollContainer = scrollerElement.wrap();
                this.scrollViewElement = scrollViewElement = component.bodyElement;

                scrollView.setElement(scrollViewElement);

                if (component.isPainted()) {
                    this.onComponentPainted(component);
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

        component.un(this.listeners);

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
