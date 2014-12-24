#Onsen UI

##Overview

This is an implementation of the PropertyCross app using [Onsen UI](http://onsen.ui). Onsen UI is a free and open source hybrid app framework released under the Apache License. It provides native-like UI components using HTML5, JavaScript and CSS. It's built using Angular directives to provide custom tags. The framework includes useful components like sliding menu, list view, dialogs, etc. that are all optimized for mobile development.

Although Onsen UI is designed to be used with any SPA framework, since it's built using Angular they work great together when designing apps. In the PropertyCross implementation Angular controllers and services are used for the application logic.

##Building The Application

Onsen UI applications can be run by serving the `www` directory using a web server and navigating to it using a browser. To deploy the application to a mobile device Cordova can be used.

##Application Structure

 + `/www/index.html` - HTML markup.
 + `/www/js` - JavaScript files.
 + `/www/js/app.js` - Defined AngularJS application module and its controllers.
 + `/www/js/services.js` - AnglularJS services for adding favourites, searching for properties and keeping track of recent searches.
 + `/www/lib` - Contains Onsen UI and it's dependencies.
 + `/www/styles` - Stylesheet data.
 + `/www/styles/app.css` - Style for the app.
