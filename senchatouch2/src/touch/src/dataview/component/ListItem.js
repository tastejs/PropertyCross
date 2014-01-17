/**
 * A ListItem is a container for {@link Ext.dataview.List} with 
 * useSimpleItems: false. 
 * 
 * ListItem configures and updates the {@link Ext.data.Model records} for  
 * the sub-component items in a list. 
 *   
 * Overwrite the `updateRecord()` method to set a sub-component's value. 
 * Sencha Touch calls `updateRecord()` whenever the data in the list updates.
 *
 * The `updatedata` event fires after `updateRecord()` runs.
 *
 * *Note*: Use of ListItem increases overhead since it generates more markup than
 * using the List class with useSimpleItems: true. This overhead is more
 * noticeable in Internet Explorer. If at all possible, use
 * {@link Ext.dataview.component.SimpleListItem} instead.
 * 
 * The following example shows how to configure and update sub-component items
 * in a list:
 *
 *     Ext.define('Twitter.view.TweetListItem', {
 *         extend: 'Ext.dataview.component.ListItem',
 *         xtype : 'tweetlistitem',
 *         requires: [
 *             'Ext.Img'
 *         ],
 *         config: {
 *             userName: {
 *                 cls: 'username'
 *             },
 *             text: {
 *                 cls: 'text'
 *             },
 *             avatar: {
 *                 docked: 'left',
 *                 xtype : 'image',
 *                 cls   : 'avatar',
 *                 width: '48px',
 *                 height: '48px'
 *             },
 *             layout: {
 *                 type: 'vbox'
 *             }
 *         },
 *     
 *         applyUserName: function(config) {
 *             return Ext.factory(config, Ext.Component, this.getUserName());
 *         },
 *     
 *         updateUserName: function(newUserName) {
 *             if (newUserName) {
 *                 this.insert(0, newUserName);
 *             }
 *         },
 *     
 *         applyText: function(config) {
 *             return Ext.factory(config, Twitter.view.TweetListItemText, this.getText());
 *         },
 *     
 *         updateText: function(newText) {
 *             if (newText) {
 *                 this.add(newText);
 *             }
 *         },
 *     
 *         applyAvatar: function(config) {
 *             return Ext.factory(config, Ext.Img, this.getAvatar());
 *         },
 *     
 *         updateAvatar: function(newAvatar) {
 *             if (newAvatar) {
 *                 this.add(newAvatar);
 *             }
 *         },
 *     
 *         updateRecord: function(record) {     
 *             if (!record) {
 *                 return;
 *             }
 *
 *             this.getUserName().setHtml(record.get('username'));
 *             this.getText().setHtml(record.get('text'));
 *             this.getAvatar().setSrc(record.get('avatar_url'));
 *             this.callParent(arguments);
 *
 *         }
 *     });
 *
 */
Ext.define('Ext.dataview.component.ListItem', {
    extend: 'Ext.dataview.component.DataItem',
    xtype : 'listitem',

    config: {
        baseCls: Ext.baseCSSPrefix + 'list-item',

        dataMap: null,

        body: {
            xtype: 'component',
            cls: 'x-list-item-body'
        },

        disclosure: {
            xtype: 'component',
            cls: 'x-list-disclosure',
            hidden: true,
            docked: 'right'
        },

        header: {
            xtype: 'component',
            cls: 'x-list-header',
            html: ' '
        },

        tpl: null,
        items: null
    },

    applyBody: function(body) {
        if (body && !body.isComponent) {
            body = Ext.factory(body, Ext.Component, this.getBody());
        }
        return body;
    },

    updateBody: function(body, oldBody) {
        if (body) {
            this.add(body);
        } else if (oldBody) {
            oldBody.destroy();
        }
    },

    applyHeader: function(header) {
        if (header && !header.isComponent) {
            header = Ext.factory(header, Ext.Component, this.getHeader());
        }
        return header;
    },

    updateHeader: function(header, oldHeader) {
        if (oldHeader) {
            oldHeader.destroy();
        }
    },

    applyDisclosure: function(disclosure) {
        if (disclosure && !disclosure.isComponent) {
            disclosure = Ext.factory(disclosure, Ext.Component, this.getDisclosure());
        }
        return disclosure;
    },

    updateDisclosure: function(disclosure, oldDisclosure) {
        if (disclosure) {
            this.add(disclosure);
        } else if (oldDisclosure) {
            oldDisclosure.destroy();
        }
    },

    updateTpl: function(tpl) {
        this.getBody().setTpl(tpl);
    },

    updateRecord: function(record) {
        var me = this,
            dataview = me.dataview || this.getDataview(),
            data = record && dataview.prepareData(record.getData(true), dataview.getStore().indexOf(record), record),
            dataMap = me.getDataMap(),
            body = this.getBody(),
            disclosure = this.getDisclosure();

        me._record = record;

        if (dataMap) {
            me.doMapData(dataMap, data, body);
        } else if (body) {
            body.updateData(data || null);
        }

        if (disclosure && record && dataview.getOnItemDisclosure()) {
            var disclosureProperty = dataview.getDisclosureProperty();
            disclosure[(data.hasOwnProperty(disclosureProperty) && data[disclosureProperty] === false) ? 'hide' : 'show']();
        }

        /**
         * @event updatedata
         * Fires whenever the data of the DataItem is updated.
         * @param {Ext.dataview.component.DataItem} this The DataItem instance.
         * @param {Object} newData The new data.
         */
        me.fireEvent('updatedata', me, data);
    },

    destroy: function() {
        Ext.destroy(this.getHeader());
        this.callParent(arguments);
    }
});
