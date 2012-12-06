/**
 * @aside guide layouts
 * @aside video layouts
 *
 * The HBox (short for horizontal box) layout makes it easy to position items horizontally in a
 * {@link Ext.Container Container}. It can size items based on a fixed width or a fraction of the total width
 * available.
 *
 * For example, an email client might have a list of messages pinned to the left, taking say one third of the available
 * width, and a message viewing panel in the rest of the screen. We can achieve this with hbox layout's *flex* config:
 *
 *     @example
 *     Ext.create('Ext.Container', {
 *         fullscreen: true,
 *         layout: 'hbox',
 *         items: [
 *             {
 *                 html: 'message list',
 *                 style: 'background-color: #5E99CC;',
 *                 flex: 1
 *             },
 *             {
 *                 html: 'message preview',
 *                 style: 'background-color: #759E60;',
 *                 flex: 2
 *             }
 *         ]
 *     });
 *
 * This will give us two boxes - one that's one third of the available width, the other being two thirds of the
 * available width:
 *
 * {@img ../guides/layouts/hbox.jpg}
 *
 * We can also specify fixed widths for child items, or mix fixed widths and flexes. For example, here we have 3 items
 * - one on each side with flex: 1, and one in the center with a fixed width of 100px:
 *
 *     @example
 *     Ext.create('Ext.Container', {
 *         fullscreen: true,
 *         layout: 'hbox',
 *         items: [
 *             {
 *                 html: 'Left item',
 *                 style: 'background-color: #759E60;',
 *                 flex: 1
 *             },
 *             {
 *                 html: 'Center item',
 *                 width: 100
 *             },
 *             {
 *                 html: 'Right item',
 *                 style: 'background-color: #5E99CC;',
 *                 flex: 1
 *             }
 *         ]
 *     });
 *
 * Which gives us an effect like this:
 *
 * {@img ../guides/layouts/hboxfixed.jpg}
 *
 * For a more detailed overview of what layouts are and the types of layouts shipped with Sencha Touch 2, check out the
 * [Layout Guide](#!/guide/layouts).
 */
Ext.define('Ext.layout.HBox', {
    extend: 'Ext.layout.AbstractBox',
    alternateClassName: 'Ext.layout.HBoxLayout',

    alias: 'layout.hbox',

    sizePropertyName: 'width',

    sizeChangeEventName: 'widthchange',

    cls: Ext.baseCSSPrefix + 'layout-hbox'
});


