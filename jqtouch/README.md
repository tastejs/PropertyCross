jQTouch PropertyCross
==========================

This is the [jQTouch](http://www.jqtouch.com/) implementation of the PropertyCross application.  jQTouch is a Zepto/jQuery plugin which provides a framework for developing iOS and Android applications.  It is both open source and free to use.

jQTouch provides a structure on which to base the HTML, the majority of the application styling, page transition animations and touch based event handling; however, it's not a fully featured application development solution so this project uses a number of other technologies fill in the gaps:

* [Knockout](http://knockoutjs.com/) - a JavaScript MVVM framework.
* [RequireJS](http://requirejs.org/) - a JavaScript file and module loader.
* [PhoneGap](http://phonegap.com/) - used to wrap the code so that it can be installed as a native application.

To aid the development process, this project makes use of (CoffeeScript)[http://coffeescript.org/] and (Sass)[http://sass-lang.com/) over JavaScript and CSS respectively.

Building the Application
========================

## Browser

As the application works as a regular webapp, you can try it out by copying the files in this directory to a web accessible location and pointing your browser at it.  It should work in Chrome, Safari (both Desktop and Mobile versions) and the Android browser.  Note that since the application loads scripts via Ajax, it will not work when served directly from the file system.

## Native Binaries

The project is designed to be built with the [PhoneGap Build](https://build.phonegap.com/) service, which produces both Android and iOS binaries from the HTML source.  Unfortunatelty the PhoneGap Build requires that the project be hosted in its own repository, and hence it can not be built directly from this location.  For testing the following "proxy" repository was set up for this purpose: [PropertyCross-jQTouch](https://github.com/MarkRhodes/PropertyCross-jQTouch).  The build itself from this repository is available here: [jQTouch PhoneGap Build](https://github.com/MarkRhodes/PropertyCross-jQTouch), note though that only the iOS and Android versions are designed to work!

The Android binary should install on your device without any problems but due to the way iOS works, the signed iOS builds will only work on our devices. If you want to test on iOS, you can setup your own PhoneGap Build app (for free!), point it at the github repository for iOS and finally configure it to use your own iOS developer certificate/distribution profile.
