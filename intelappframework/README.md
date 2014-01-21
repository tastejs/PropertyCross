#Intel App Framework

Visit the [Intel App Framework page](http://propertycross.com/intel-app-framework/) on the PropertyCross website for screenshots and code sharing metrics.

##Overview

[Intel App Framework](http://app-framework-software.intel.com/) is a framework for building cross-platform mobile application using HTML5 technologies. The framework started life as jqMobi, a mobile optimised version of jQuery, which was created by the team behind [appMobi](http://www.appmobi.com/). Intel acquired the jqMobi tools and staff in February 2013.

Intel App Framework is free and open sourced under an MIT licence. Intel also offer [XDK](http://html5dev-software.intel.com/), which is a a full suite of tools built around the App Framework. XDK adds an IDE, build tools and an emulator.

Along with its lightweight JavaScript library, Intel App Framework provides a basic [MVC framework](http://app-framework-software.intel.com/docmvc.php) and many UI components. Rather than mimicking the native look and feel, the framework has opted for providing its own styles which looks the same across all platforms. Styles can be customised using the framework “[Style Builder](http://app-framework-software.intel.com/style.php)”. The Intel App Framework version of PropertyCross uses [PhoneGap Build](https://build.phonegap.com/) in order to create the native packages.

##Building The Application

Applications developed with Intel App Framework (IAF) can be run directly within a web browser. Because the application uses XHR in order to load templates, if you run the application from your local file system you will encounter problems due to the [same origin policy](http://en.wikipedia.org/wiki/Same_origin_policy). You can solve this either by serving the app from a web server, or by using one of the [Chrome switches](http://peter.sh/experiments/chromium-command-line-switches/) that disables this policy.

The IAP application is packaged using [PhoneGap Build](https://build.phonegap.com/) - see [`/phonegap/README.md`](https://github.com/tastejs/PropertyCross/tree/master/phonegap) for details.

##Application Structure

 + `\assets` - icons and splashscreens used by PhoneGap, these are generated via the [PropertyCross build system](https://github.com/ColinEberhardt/PropertyCross/tree/master/build).
 + `\controllers` - IAF controllers, these form part of the MVC implementation
 + `\css` - the application CSS, this is the out-of-the-box IAF style.
 + `\img` - application images
 + `\js` - the IAF framework code
 + `\models` - the persisted entities
 + `\views` - the HTML templates that are used as the application views
 + `app.js` - the application 'bootstrap'
 + `config.xml` - The XML file that is used by PhoneGap Build in order to package the app
 + `index.html` - Defines the various view for the application.
 + `stats-config.json` - Used by the PropertyCross build in order to compute code sharing metrics.
