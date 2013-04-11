/**
 *
 * @private
 * A utility class to disable input fields in WP7,8 because they stay still clickable even if they are under other elements.
 */
Ext.define('Ext.util.InputBlocker', {
    blockInputs: function () {
        if (Ext.browser.is.ie) {
            Ext.select('.x-field-text .x-field-input:not(.x-item-disabled) .x-input-el, .x-field-textarea .x-field-input:not(.x-item-disabled) .x-input-el').each(function (item) {
				if (item.dom.offsetWidth > 0) {
                    item.dom.setAttribute('disabled', true);
                    item.dom.setAttribute('overlayfix', true);
                }
            });
        }
    },
    unblockInputs: function () {
        if (Ext.browser.is.ie) {
            Ext.select('[overlayfix]').each(function (item) {
                item.dom.removeAttribute('disabled');
                item.dom.removeAttribute('overlayfix');
            });
        }
    }
});
