# PhoneJS

Visit the [PhoneJS page](http://propertycross.com/phonejs/) on the PropertyCross website for screenshots and code sharing metrics.

##Introduction

[PhoneJS](http://phonejs.devexpress.com/) is a commercial HTML5 framework for cross platform mobile application development from [DevExpress](http://www.devexpress.com/). PhoneJS is free for non-commercial use. 

PhoneJS uses the [Knockout](http://knockoutjs.com/) MVVM framework for structuring the application, with the PhoneJS CSS providing a native-styled UI for the various phone platforms. PhoneJS applications use [PhoneGap](http://phonegap.com/) for packaging.

DevExpress also offers a more integrated solution based on PhoneJS, called [DevExtreme](http://www.devexpress.com/Products/HTML-JS/), which adds Visual Studio tooling.

## Building

The documentation for PhoneJS can be [found online](http://phonejs.devexpress.com/Documentation). PhoneJS applications can be run directly from a browser, although you have to override the browser UserAgent or use a simulator such as [Ripple](http://emulate.phonegap.com/) in order to mimic a mobile browser.

The PhoneJS application is packaged using [PhoneGap Build](https://build.phonegap.com/), with the configuration specified in the `config.xml` file.

##Application Structure

 + `\css` - The PhoneJS CSS files for the various supported platforms.
 + `\images` - The images used by this app.
 + `\js` - The PhoneJS framework, and associated dependencies, including jQuery and Knockout.
 + `\layouts` - Templates used by PhoneJS to describe standard screen layouts.
 + `\Resources` - icons and splashscreens used by PhoneGap.
 + `\views` - contains the HTML views and the view models for this application.
 + `.htaccess` - HTTP no-cache settings for testing purposes
 + `cordova.js` - The PhoneGap JavaScript file.
 + `create-package.cmd` - script that creates the PhoneGap package, removing unnecessary files.
 + `index.html` - Defines the various view for the application.
 + `package-exclude.txt` - used by `create-package.cmd`.
 + `stats-config.json` - Used by the PropertyCross build in order to compute code sharing metrics.