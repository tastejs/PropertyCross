#KendoUI PropertyCross

Visit the [KendoUI page](http://propertycross.com/kendoui/) on the PropertyCross website for screenshots and code sharing metrics.

##Introduction

This is an implementation of the PropertyCross application using [Kendo UI Mobile](http://www.kendoui.com/), a commercial framework for creating mobile UIs that mimic the native look and feel of mobile applications using HTML.

[Kendo](http://www.kendoui.com/) provide a suite of web development frameworks, all of which are built on top of the 'core' Kendo UI MVVM framework. The Kendo UI Mobile framework adds a set of UI widgets for the creation of mobile interfaces. The mobile framework has a look and feel that mimics the native Apple, Android and Windows Phone themes.

This PropertyCross implementation makes use of [Cordova / PhoneGap](http://phonegap.com/), which packages the HTML / JavaScript within a native wrapper for app-store deployment. Cordova also provides a set of APIs for accessing native phone functionalities which are not available via HTML specifications.

##Building the Application

Applications developed with Kendo can be run directly within a web browser control. 

The Kendo application is packaged using [PhoneGap Build](https://build.phonegap.com/), with the configuration specified in the `config.xml` file.

##Application Structure

 + `\assets` - icons and splashscreens used by PhoneGap, these are generated via the [PropertyCross build system](https://github.com/ColinEberhardt/PropertyCross/tree/master/build).
 + `\img` - images used by the app.
 + `\js` - the JavaScript frameworks used by this implementation, KendoUI and jQuery.
 + `\styles` - the KendoUI CSS files for the various platforms.
 + `\viewModel` - The view models that implement the PropertyCross logic.
 + `app.js` - The application boot strap, includes code for managing the back stack
 + `app.js` - The Windows Phone application boot strap, includes code for managing the back stack.
 + `config.xml` - The XML file that is used by PhoneGap Build in order to package the app
 + `index.html` - Defines the various view for the application.
 + `stats-config.json` - Used by the PropertyCross build in order to compute code sharing metrics.
 + `style.css` - The application specific styles.

##References

 + [Comparing KendoUI with Knockout](http://www.scottlogic.co.uk/blog/colin/2013/04/comparing-kendoui-and-knockout-with-a-bit-of-jquerymobile-on-the-side/) - a blog post that compares the Kendo MVVM implementation with Knockout.