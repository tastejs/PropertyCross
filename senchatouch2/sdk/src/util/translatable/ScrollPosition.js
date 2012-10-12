/**
 * @private
 *
 * Scroll position implementation
 */
Ext.define('Ext.util.translatable.ScrollPosition', {
    extend: 'Ext.util.translatable.Abstract',

    wrapperWidth: 0,

    wrapperHeight: 0,

    baseCls: 'x-translatable',

    config: {
        useWrapper: true
    },

    getWrapper: function() {
        var wrapper = this.wrapper,
            baseCls = this.baseCls,
            element = this.getElement(),
            nestedStretcher, container;

        if (!wrapper) {
            container = element.getParent();

            if (!container) {
                return null;
            }

            if (this.getUseWrapper()) {
                wrapper = element.wrap({
                    className: baseCls + '-wrapper'
                }, true);
            }
            else {
                wrapper = container.dom;
            }

            wrapper.appendChild(Ext.Element.create({
                className: baseCls + '-stretcher'
            }, true));

            this.nestedStretcher = nestedStretcher = Ext.Element.create({
                className: baseCls + '-nested-stretcher'
            }, true);

            element.appendChild(nestedStretcher);

            element.addCls(baseCls);
            container.addCls(baseCls + '-container');

            this.container = container;
            this.wrapper = wrapper;

            this.refresh();
        }

        return wrapper;
    },

    doTranslate: function(x, y) {
        var wrapper = this.getWrapper();

        if (wrapper) {
            if (typeof x == 'number') {
                wrapper.scrollLeft = this.wrapperWidth - x;
            }

            if (typeof y == 'number') {
                wrapper.scrollTop = this.wrapperHeight - y;
            }
        }

        return this.callParent(arguments);
    },

    refresh: function() {
        var wrapper = this.getWrapper();

        if (wrapper) {
            this.wrapperWidth = wrapper.offsetWidth;
            this.wrapperHeight = wrapper.offsetHeight;

            this.callParent(arguments);
        }
    },

    destroy: function() {
        var element = this.getElement(),
            baseCls = this.baseCls;

        if (this.wrapper) {
            if (this.getUseWrapper()) {
                element.unwrap();
            }

            this.container.removeCls(baseCls + '-container');
            element.removeCls(baseCls);
            element.removeChild(this.nestedStretcher);
        }

        this.callParent(arguments);
    }

});
