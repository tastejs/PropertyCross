#Emy

Visit the [Emy page](http://propertycross.com/emy/) on the PropertyCross website for screenshots and code sharing metrics.

##Overview

[Emy](http://www.emy-library.org/) is a lightweight library for building cross-platform mobile application using HTML5 and CSS3 technologies. It is shown here with its own theme, but has [themes](http://www.emy-library.org/plugins.html) available for iOS, Android and Windows Phone (although at the time of writing, the downloads for these did not appear to work).

Emy is free and open sourced under an MIT licence.

The Emy version of PropertyCross uses [PhoneGap Build](https://build.phonegap.com/) in order to create the native packages.

##Building The Application

Applications developed with Emy can be run directly within a web browser. Because the application uses XHR in order to load templates, if you run the application from your local file system you will encounter problems due to the [same origin policy](http://en.wikipedia.org/wiki/Same_origin_policy). You can solve this either by serving the app from a web server, or by using one of the [Chrome switches](http://peter.sh/experiments/chromium-command-line-switches/) that disables this policy.

The Emy application is packaged using [PhoneGap Build](https://build.phonegap.com/) - see [`/phonegap/README.md`](https://github.com/tastejs/PropertyCross/tree/master/phonegap) for details.

##Application Structure

 + `/www/assets` - icons and splashscreens used by PhoneGap, these are generated via the [PropertyCross build system](https://github.com/tastejs/PropertyCross/tree/master/build).
 + `/www/emy` - The Emy library and theme
 + `/www/css` - the application CSS customisation
 + `/www/images` - application images
 + `/www/scripts` - the javascript code
 + `/www/index.html` - Defines the various view for the application.
 + `/Gruntfile.js` - the [Grunt](http://gruntjs.com) build specification
 + `/package.json` - project metadata for Grunt and NPM
