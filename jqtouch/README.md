#jQTouch PropertyCross

Visit the [jQTouch page](http://propertycross.com/jqtouch/) on the PropertyCross website for screenshots and code sharing metrics.

##Introduction

[jQTouch](http://jqtjs.com/) is a Zepto/jQuery plugin which provides a framework for developing iOS and Android applications.  It is both open source and free to use.

jQTouch provides a structure on which to base the HTML, the majority of the application styling, page transition animations and touch based event handling; however, it's not a fully featured application development solution so this project uses a number of other technologies fill in the gaps:

* [Knockout](http://knockoutjs.com/) - a JavaScript MVVM framework.
* [RequireJS](http://requirejs.org/) - a JavaScript file and module loader.
* [PhoneGap](http://phonegap.com/) - used to wrap the code so that it can be installed as a native application.

To aid the development process, this project makes use of [CoffeeScript](http://coffeescript.org/) and [Sass](http://sass-lang.com/) over JavaScript and CSS respectively.

##Building The Application

Applications developed with jQTouch can be run directly within a web browser control. Because the application uses XHR in order to load templates, if you run the application from your local file system you will encounter problems due to the [same origin policy](http://en.wikipedia.org/wiki/Same_origin_policy). You can solve this either by serving the app from a web server, or by using one of the [Chrome switches](http://peter.sh/experiments/chromium-command-line-switches/) that disables this policy.

The jQTouch application is packaged using [PhoneGap Build](https://build.phonegap.com/), with the configuration specified in the `config.xml` file.

##Application Structure

 + `\assets` - Icons and splashscreens used by PhoneGap, these are generated via the [PropertyCross build system](https://github.com/ColinEberhardt/PropertyCross/tree/master/build).
 + `\dataSource` - CoffeeScript for application data sources. 
 + `\lib` - The various JavaScript frameworks used by this implementation
 + `\model` - CoffeeScript defining base models of the application.
 + `\style` - The application specific styles, generated using SaSS.
 + `\themes` - The standard jQTouch CSS.
 + `\util` - CoffeeScript defining utility classes or functions. 
 + `\viewModel` - The view models that implement the PropertyCross logic.
 + `coffee-script.js` - The CoffeeScript JS compiler v1.4.0 - http://coffeescript.org. 
 + `config.xml` - The XML file that is used by PhoneGap Build in order to package the app
 + `cs.js` - The CoffeeScript RequireJS plugin - http://github.com/jrburke/require-cs. 
 + `index.html` - Defines the various views for the application and imports required CSS and scripts.
 + `main.coffee` - The main entry point of the application.
 + `stats-config.json` - Used by the PropertyCross build in order to compute code sharing metrics.
