/**
 * @private
 * Windows Phone version of Viewport.
 */
Ext.define('Ext.viewport.WindowsPhone', {
    requires: [],

    alternateClassName: 'Ext.viewport.WP',

    extend: 'Ext.viewport.Default',

    // so one pixel line is displayed on the right side of the screen. Setting width more than 100% fix the issue
//    config: {
//        width: '100.2%',
//        height: '100.2%'
//    },

    config: {
        translatable: {
            translationMethod: 'csstransform'
        }
    },

    initialize: function () {
        // There is -ms-user-select CSS property for IE10, but it seems it works only in desktop browser. So we need to prevent selection event.
        var preventSelection = function(e) {
            var srcElement = e.srcElement.nodeName.toUpperCase(),
                selectableElements = ['INPUT', 'TEXTAREA'];

            if (selectableElements.indexOf(srcElement) == -1) {
                return false;
            }
        };

        document.body.addEventListener('onselectstart', preventSelection);

        this.callParent(arguments);
    },

    supportsOrientation: function() {
        return false;
    },

    onResize: function() {
        this.waitUntil(function() {
            var oldWidth = this.windowWidth,
                oldHeight = this.windowHeight,
                width = this.getWindowWidth(),
                height = this.getWindowHeight(),
                currentOrientation = this.getOrientation(),
                newOrientation = this.determineOrientation();

            return ((oldWidth !== width && oldHeight !== height) && currentOrientation !== newOrientation);
        }, function() {
            var currentOrientation = this.getOrientation(),
                newOrientation = this.determineOrientation();
            this.fireOrientationChangeEvent(newOrientation, currentOrientation);

        }, Ext.emptyFn, 250);
    }
});
