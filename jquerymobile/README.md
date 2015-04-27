#jQuery Mobile Implementation

Visit the [jQuery Mobile page](http://propertycross.com/jquerymobile/) on the PropertyCross website for screenshots and code sharing metrics.

##Introduction

[jQuery Mobile](http://jquerymobile.com) is a HTML5 framework which makes it easy to create mobile applications, by using own set of UI widgets. This is achieved by providing HTML that is marked up with various jQuery Mobile specific attributes, which is then processed to generate the final markup. Within PropertyCross jQuery Mobile is combined with [KnockoutJS](http://knockoutjs.com/), which provides a presentation model (MVVM), [RequireJS](http://requirejs.org/), for dependency management, and [Cordova / PhoneGap](http://phonegap.com/), which packages the HTML / JavaScript within a native wrapper for app-store deployment. Cordova also provides a set of APIs for accessing native phone functionalities which are not available via HTML specifications.

##Building the Application

Applications developed with jQuery Mobile can be run directly within a web browser control. 

The jQuery Mobile application is packaged using [PhoneGap Build](https://build.phonegap.com/), with the configuration specified in the `config.xml` file.

##Application Structure

 + `config.xml` - The XML file that is used by PhoneGap Build in order to package the app
 + `stats-config.json` - Used by the PropertyCross build in order to compute code sharing metrics.
 + `\www` - Contains the assets, Javascript code, css and html files that will be included in the application
   + `\assets` - icons and splashscreens used by PhoneGap, these are generated via the [PropertyCross build system](https://github.com/ColinEberhardt/PropertyCross/tree/master/build).
   + `\lib` - the various JavaScript frameworks used by this implementation. This includes jQuery Mobile, the jQM iScroll plugin, Knockout and Require. This folder also contains the jQM CSS files.
   + `\model` - the model layer of the application, includes the code that communicates to the Nestoria APIs.
   + `\style` - the application specific styles.
   + `\viewModel` - The view models that implement the PropertyCross logic.
   + `app.js` - The application boot strap, includes code for managing the back stack
   + `index.html` - Defines the various view for the application.

##Further Reading

 + [Integrating Knockout and jQuery Mobile](http://www.scottlogic.co.uk/blog/colin/2012/10/integrating-knockout-and-jquerymobile/) - a blog post that describes the experiences of integrating these two frameworks.
 + [Property Finder - a Cross-Platform HTML5 Mobile App](http://www.codeproject.com/Articles/445361/Property-Finder-a-cross-platform-HTML5-mobile-app) - an article which describes an early version of this application.


