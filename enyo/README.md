Enyo PropertyCross
=========

This is the [PropertyCross](http://propertycross.com/) application written with the [Enyo JavaScript framework](http://enyojs.com).  The purpose of PropertyCross is to allow developers to compare different frameworks and how they are utilized.

Enyo JavaScript Framework
=========

Enyo is a free and open source (Apache 2.0 license) cross-platform and cross-browser application development framework that enables developers to easily create applications and deploy them to many modern desktop browsers and mobile devices.  See if your favorite platform is listed [here](http://enyojs.com/docs/platforms/).

Enyo is built around the philosophy of fully-encapsulated components, which allow a developer to reuse component pieces (or even an entire application) in new or existing projects.  In fact, it is possible to embed full Enyo applications in the DOM elements of existing Web pages.

Instead of relying on complicated templating mechanisms, enyo.Controls (a kind of enyo.Component) render themselves into the DOM based on their owner/parent hierarchy in the application structure.  Developers do not have to spend time with HTML layout.  They design the entire application structure/component with JavaScript object literals, add some methods and properties for functionaltity, and they are off to the app races!

Enyo has a dependency mechanism (package.js) to enable a basic modular approach to building applications.  If you look at most Enyo projects, you will see references to a __$lib__ directory in one or more package.js files, usually to include optional modules such as [Layout](https://github.com/enyojs/layout) (our Lists and responsive components) and [Onyx](https://github.com/enyojs/onyx) (our widget library).

The 2.2 release of Enyo (current stable as of this writing) does not provide out-of-the-box MVC support or data-binding.  Developers can integrate any other JavaScript library or framework very easily with Enyo.  Many developers have used [Backbone](http://backbonejs.org/) to create MVC-style applications with Enyo.

The next release of Enyo (2.3 target) will include our MVC support structure and data-binding implementation.  There may (will probably) be another PropertyCross implementation done with Enyo MVC so that developers can see the differences between traditional Enyo style and the new (optional) MVC style with models, controllers, bindings, etc.  You can try it out for yourself today just by cloning the [current master branch](https://github.com/enyojs/enyo).

Enyo PropertyCross Source Structure
=========

	repo/
		...
		enyo/  #this is the project directory and where index.html (for a deployed app) and debug.html (for building and testing) are located
			assets/  #this is where you can place application assets, such as images
			enyo/  #the unminified framework source
			lib/  #the unminified module sources
			source/ #the application source
		...

Building Enyo PropertyCross
=========
This application is based on the [Bootplate project](https://github.com/enyojs/bootplate) to enabled easy packaging and deployment.  See the project [wiki](https://github.com/enyojs/enyo/wiki/Bootplate) for complete instructions.

You can run the un-minifed version directly in your browser for easy testing.  Just open index.html located in the enyo/source directory of this repository.