# DevExtreme

Visit the [DevExtreme page](http://propertycross.com/devextreme/) on the PropertyCross website for screenshots and code sharing metrics.

##Introduction

[DevExtreme](http://js.devexpress.com/) is a commercial cross-platform HTML5/JavaScript tools for mobile and web development from [DevExpress](http://www.devexpress.com/). 

DevExtreme Mobile provides the way to use one of popular MVVM frameworks ([Knockout](http://knockoutjs.com/) or [AngularJS](https://angularjs.org/)) for structuring the application, with the DevExtreme CSS providing a native-styled UI for the various phone platforms. DevExtreme mobile applications use [PhoneGap](http://phonegap.com/) for packaging.

DevExtreme Complete subscription is a more integrated solution which adds Visual Studio tooling.

## Building

The documentation for DevExtreme can be [found online](http://js.devexpress.com/Documentation). DevExtreme applications can be run directly from a browser, although you have to override the browser UserAgent or use a simulator such as [Ripple](http://emulate.phonegap.com/) in order to mimic a mobile browser.

The DevExtreme mobile application is packaged using [PhoneGap Build](https://build.phonegap.com/), with the configuration specified in the `config.xml` file.

##Application Structure

 + `\css` - The DevExtreme CSS files for the various supported platforms.
 + `\images` - The images used by this app.
 + `\js` - The DevExtreme framework, and associated dependencies, including jQuery and Knockout.
 + `\layouts` - Templates used by DevExtreme to describe standard screen layouts.
 + `\Resources` - icons and splashscreens used by PhoneGap.
 + `\views` - contains the HTML views and the view models for this application.
 + `.htaccess` - HTTP no-cache settings for testing purposes
 + `cordova.js` - The PhoneGap JavaScript file.
 + `create-package.cmd` - script that creates the PhoneGap package, removing unnecessary files.
 + `index.html` - Defines the various view for the application.
 + `package-exclude.txt` - used by `create-package.cmd`.
 + `stats-config.json` - Used by the PropertyCross build in order to compute code sharing metrics.