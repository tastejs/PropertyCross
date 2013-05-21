#jQuery Mobile Implementation

Visit the [jQuery Mobile page](http://propertycross.com/jquerymobile/) on the PropertyCross website for screenshots and code sharing metrics.

##Introduction

[jQuery Mobile](http://jquerymobile.com) is a HTML5 framework which makes it easy to create websites that mimic the iOS look and feel. This is achieved by providing HTML that is marked up with various jQuery Mobile specific attributes, which is then processed to generate the final markup. Within PropertyCross jQuery Mobile is combined with [KnockoutJS](http://knockoutjs.com/), which provides a presentation model (MVVM), [RequireJS](http://requirejs.org/), for dependency management, and [Cordova / PhoneGap](http://phonegap.com/), which packages the HTML / JavaScript within a native wrapper for app-store deployment. Cordova also provides a set of APIs for accessing native phone functionalities which are not available via HTML specifications.

The JavaScript Model and ViewModel code is shared across all mobile platforms, whereas the HTML files, which make up the View, are specific for each platform. This allows the UI for each platform to be tailored to the requirements of each platform. The iOS version uses the out-of-the-box jQuery Mobile styles, whereas Windows Phone uses the [jquery-metro-theme](http://sgrebnov.github.com/jqmobile-metro-theme/) extensions to support the Metro UI style together with Windows Phone specific features such as the app-bar.

We were unable to find a suitable theme or plugin for the Android version, as a result, the Android version uses the iOS style.

##Building the Application

Applications developed with jQuery Mobile can be run directly within a web browser control. 

The jQuery Mobile application is packaged using [PhoneGap Build](https://build.phonegap.com/), with the configuration specified in the `config.xml` file.

##Application Structure

 + `\assets` - icons and splashscreens used by PhoneGap, these are generated via the [PropertyCross build system](https://github.com/ColinEberhardt/PropertyCross/tree/master/build).
 + `\bin` - contains the compiler which is used to remove the RequireJS dependency and package the two different versions of this app.
 + `\lib` - the various JavaScript frameworks used by this implementation. This includes jQuery Mobile, the jQM iScroll plugin, Knockout and Require. This folder also contains the jQM CSS files.
 + `\model` - the model layer of the application, includes the code that communicates to the Nestoria APIs.
 + `\style` - the application specific styles.
 + `\style-windowsphone` - the application specific styles for Windows Phone
 + `\viewModel` - The view models that implement the PropertyCross logic.
 + `app.js` - The application boot strap, includes code for managing the back stack
 + `app.js` - The Windows Phone application boot strap, includes code for managing the back stack
 + `build.sh` - A build file which packages up the iOS/Android and Windows Phone version of the code ready for PhoneGap Build.
 + `config.xml` - The XML file that is used by PhoneGap Build in order to package the app
 + `config-windowsphone.xml` - The Windows Phone version
 + `index.html` - Defines the various view for the application.
 + `index-windowsphone.html` - The Windows Phone version
 + `stats-config.json` - Used by the PropertyCross build in order to compute code sharing metrics.

##References

 + [Integrating Knockout and jQuery Mobile](http://www.scottlogic.co.uk/blog/colin/2012/10/integrating-knockout-and-jquerymobile/) - a blog post that describes the experiences of integrating these two frameworks.
 + [Property Finder - a Cross-Platform HTML5 Mobile App](http://www.codeproject.com/Articles/445361/Property-Finder-a-cross-platform-HTML5-mobile-app) - an article which describes an early version of this application.


