/*

This file is part of Sencha Touch 2

Copyright (c) 2012 Sencha Inc

Contact:  http://www.sencha.com/contact

Commercial Usage
Licensees holding valid commercial licenses may use this file in accordance with the Commercial Software License Agreement provided with the Software or, alternatively, in accordance with the terms contained in a written agreement between you and Sencha.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
(function(c){if(typeof a==="undefined"){var a=c.Ext={}}function b(e){document.write(e)}function d(e,f){b('<meta name="'+e+'" content="'+f+'">')}a.blink=function(f){var e=f.js||[],j=f.css||[],g,h,k;d("viewport","width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no");d("apple-mobile-web-app-capable","yes");d("apple-touch-fullscreen","yes");for(g=0,h=j.length;g<h;g++){k=j[g];if(typeof k!="string"){k=k.path}b('<link rel="stylesheet" href="'+k+'">')}for(g=0,h=e.length;g<h;g++){k=e[g];if(typeof k!="string"){k=k.path}b('<script src="'+k+'"><\/script>')}}})(this);
