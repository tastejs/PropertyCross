/**
 * @aside guide layouts
 * @aside video layouts
 *
 * The VBox (short for vertical box) layout makes it easy to position items horizontally in a
 * {@link Ext.Container Container}. It can size items based on a fixed height or a fraction of the total height
 * available.
 *
 * For example, let's say we want a banner to take one third of the available height, and an information panel in the
 * rest of the screen. We can achieve this with vbox layout's *flex* config:
 *
 *     @example
 *     Ext.create('Ext.Container', {
 *         fullscreen: true,
 *         layout: 'vbox',
 *         items: [
 *             {
 *                 html: 'Awesome banner',
 *                 style: 'background-color: #759E60;',
 *                 flex: 1
 *             },
 *             {
 *                 html: 'Some wonderful information',
 *                 style: 'background-color: #5E99CC;',
 *                 flex: 2
 *             }
 *         ]
 *     });
 *
 * This will give us two boxes - one that's one third of the available height, the other being two thirds of the
 * available height:
 *
 * {@img ../guides/layouts/vbox.jpg}
 *
 * We can also specify fixed heights for child items, or mix fixed heights and flexes. For example, here we have 3
 * items - one at the top and bottom with flex: 1, and one in the center with a fixed width of 100px:
 *
 *     @example preview portrait
 *     Ext.create('Ext.Container', {
 *         fullscreen: true,
 *         layout: 'vbox',
 *         items: [
 *             {
 *                 html: 'Top item',
 *                 style: 'background-color: #5E99CC;',
 *                 flex: 1
 *             },
 *             {
 *                 html: 'Center item',
 *                 height: 100
 *             },
 *             {
 *                 html: 'Bottom item',
 *                 style: 'background-color: #759E60;',
 *                 flex: 1
 *             }
 *         ]
 *     });
 *
 * Which gives us an effect like this:
 *
 * {@img ../guides/layouts/vboxfixed.jpg}
 *
 * For a more detailed overview of what layouts are and the types of layouts shipped with Sencha Touch 2, check out the
 * [Layout Guide](#!/guide/layouts).
 *
 */
Ext.define('Ext.layout.VBox', {
    extend: 'Ext.layout.AbstractBox',
    alternateClassName: 'Ext.layout.VBoxLayout',

    alias: 'layout.vbox',

    sizePropertyName: 'height',

    sizeChangeEventName: 'heightchange',

    cls: Ext.baseCSSPrefix + 'layout-vbox'
});
