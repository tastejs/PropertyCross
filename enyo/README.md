#Enyo PropertyCross

Visit the [Enyo page](http://propertycross.com/enyo/) on the PropertyCross website for screenshots and code sharing metrics.

##Introduction

Enyo is a free and open source (Apache 2.0 license) cross-platform and cross-browser application development framework that enables developers to create HTML5 applications and deploy them to many modern desktop browsers and mobile devices.  

Enyo is built around the philosophy of fully-encapsulated components, which allow a developer to reuse component pieces (or even an entire application) in new or existing projects.  It is possible to embed full Enyo applications in the DOM elements of existing Web pages.

Enyo does not use templating, instead enyo.Controls (a kind of enyo.Component) render themselves into the DOM based on their owner/parent hierarchy in the application structure. Developers design the application structure/component with JavaScript object literals, adding methods and properties for functionality.

Enyo has a dependency mechanism (package.js) to enable a basic modular approach to building applications.  If you look at most Enyo projects, you will see references to a __$lib__ directory in one or more package.js files, usually to include optional modules such as [Layout](https://github.com/enyojs/layout) (lists and responsive components) and [Onyx](https://github.com/enyojs/onyx) (a widget library).

##Application Structure

 + `src/`
   + `enyo/` - the unminified framework source
   + `lib/` - the unminified module sources
   + `source/` - the application source
   + `index.html` - for a deployed app
   + `debug.html` - for building and testing
 + `assets/` - application assets, such as images, as well as icons and splashscreens used by PhoneGap

##Building The Application

This application is based on the [Bootplate project](https://github.com/enyojs/bootplate) to enabled easy packaging and deployment.  See the project [wiki](https://github.com/enyojs/enyo/wiki/Bootplate) for complete instructions.

You can run the un-minifed version directly in your browser for easy testing.  Just open index.html located in the enyo/source directory of this repository.