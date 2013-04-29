/**
 * @aside guide layouts
 * @aside video layouts
 *
 * AbstractBox is a superclass for the two box layouts:
 *
 * * {@link Ext.layout.HBox hbox}
 * * {@link Ext.layout.VBox vbox}
 *
 * FlexBox itself is never used directly, but its subclasses provide flexible arrangement of child components
 * inside a {@link Ext.Container Container}. For a full overview of layouts check out the
 * [Layout Guide](#!/guide/layouts).
 *
 * ## Horizontal Box
 *
 * HBox allows you to easily lay out child components horizontally. It can size items based on a fixed width or a
 * fraction of the total width available, enabling you to achieve flexible layouts that expand or contract to fill the
 * space available.
 *
 * {@img ../guides/layouts/hbox.jpg}
 *
 * See the {@link Ext.layout.HBox HBox layout docs} for more information on using hboxes.
 *
 * ## Vertical Box
 *
 * VBox allows you to easily lay out child components verticaly. It can size items based on a fixed height or a
 * fraction of the total height available, enabling you to achieve flexible layouts that expand or contract to fill the
 * space available.
 *
 * {@img ../guides/layouts/vbox.jpg}
 *
 * See the {@link Ext.layout.VBox VBox layout docs} for more information on using vboxes.
 */
Ext.define('Ext.layout.FlexBox', {
    extend: 'Ext.layout.Box',

    alias: 'layout.box',

    config: {
        align: 'stretch'
    },

    layoutBaseClass: 'x-layout-box',

    itemClass: 'x-layout-box-item',

    setContainer: function(container) {
        this.callSuper(arguments);

        this.monitorSizeFlagsChange();
    },

    applyOrient: function(orient) {
        //<debug error>
        if (orient !== 'horizontal' && orient !== 'vertical') {
            Ext.Logger.error("Invalid box orient of: '" + orient + "', must be either 'horizontal' or 'vertical'");
        }
        //</debug>

        return orient;
    },

    updateOrient: function(orient, oldOrient) {
        var container = this.container,
            delegation = {
                delegate: '> component'
            };

        if (orient === 'horizontal') {
            this.sizePropertyName = 'width';
        }
        else {
            this.sizePropertyName = 'height';
        }

        container.innerElement.swapCls('x-' + orient, 'x-' + oldOrient);

        if (oldOrient) {
            container.un(oldOrient === 'horizontal' ? 'widthchange' : 'heightchange', 'onItemSizeChange', this, delegation);
            this.redrawContainer();
        }

        container.on(orient === 'horizontal' ? 'widthchange' : 'heightchange', 'onItemSizeChange', this, delegation);
    },

    onItemInnerStateChange: function(item, isInner) {
        this.callSuper(arguments);

        var flex, size;

        item.toggleCls(this.itemClass, isInner);

        if (isInner) {
            flex = item.getFlex();
            size = item.get(this.sizePropertyName);

            if (flex) {
                this.doItemFlexChange(item, flex);
            }
            else if (size) {
                this.doItemSizeChange(item, size);
            }
        }

        this.refreshItemSizeState(item);
    },

    refreshItemSizeState: function(item) {
        var isInner = item.isInnerItem(),
            container = this.container,
            LAYOUT_HEIGHT = container.LAYOUT_HEIGHT,
            LAYOUT_WIDTH = container.LAYOUT_WIDTH,
            dimension = this.sizePropertyName,
            layoutSizeFlags = 0,
            containerSizeFlags = container.getSizeFlags();

        if (isInner) {
            layoutSizeFlags |= container.LAYOUT_STRETCHED;

            if (this.getAlign() === 'stretch') {
                layoutSizeFlags |= containerSizeFlags & (dimension === 'width' ? LAYOUT_HEIGHT : LAYOUT_WIDTH);
            }

            if (item.getFlex()) {
                layoutSizeFlags |= containerSizeFlags & (dimension === 'width' ? LAYOUT_WIDTH : LAYOUT_HEIGHT);
            }
        }

        item.setLayoutSizeFlags(layoutSizeFlags);
    },

    refreshAllItemSizedStates: function() {
        var innerItems = this.container.innerItems,
            i, ln, item;

        for (i = 0,ln = innerItems.length; i < ln; i++) {
            item = innerItems[i];
            this.refreshItemSizeState(item);
        }
    },

    onContainerSizeFlagsChange: function() {
        this.refreshAllItemSizedStates();

        this.callSuper(arguments);
    },

    onItemSizeChange: function(item, size) {
        if (item.isInnerItem()) {
            this.doItemSizeChange(item, size);
        }
    },

    doItemSizeChange: function(item, size) {
        if (size) {
            item.setFlex(null);
            this.redrawContainer();
        }
    },

    onItemFlexChange: function(item, flex) {
        if (item.isInnerItem()) {
            this.doItemFlexChange(item, flex);
            this.refreshItemSizeState(item);
        }
    },

    doItemFlexChange: function(item, flex) {
        this.setItemFlex(item, flex);

        if (flex) {
            item.set(this.sizePropertyName, null);
        }
        else {
            this.redrawContainer();
        }
    },

    redrawContainer: function() {
        var container = this.container,
            renderedTo = container.element.dom.parentNode;

        if (renderedTo && renderedTo.nodeType !== 11) {
            container.innerElement.redraw();
        }
    },

    /**
     * Sets the flex of an item in this box layout.
     * @param {Ext.Component} item The item of this layout which you want to update the flex of.
     * @param {Number} flex The flex to set on this method
     */
    setItemFlex: function(item, flex) {
        var element = item.element;

        element.toggleCls('x-flexed', !!flex);

        if (!flex) {
            flex = '';
        }
        else {
            flex = String(flex);
        }

        if (Ext.browser.is.WebKit) {
            element.dom.style.setProperty('-webkit-box-flex', flex, null);
        }
        else if (Ext.browser.is.IE) {
            element.dom.style.setProperty('-ms-flex', flex + ' 0 0px', null);
        }
        else {
            element.dom.style.setProperty('flex', flex + ' 0 0px', null);
        }
    },

    convertPosition: function(position) {
        var positionMap = this.positionMap;

        if (positionMap.hasOwnProperty(position)) {
            return positionMap[position];
        }

        return position;
    },

    applyAlign: function(align) {
        return this.convertPosition(align);
    },

    updateAlign: function(align, oldAlign) {
        var container = this.container;

        container.innerElement.swapCls(align, oldAlign, true, 'x-align');

        if (oldAlign !== undefined) {
            this.refreshAllItemSizedStates();
        }
    },

    applyPack: function(pack) {
        return this.convertPosition(pack);
    },

    updatePack: function(pack, oldPack) {
        this.container.innerElement.swapCls(pack, oldPack, true, 'x-pack');
    }
});
