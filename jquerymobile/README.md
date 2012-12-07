jQuery Mobile PropertyCross
==========================

This is an implementation of the PropertyCross application using [jQuery Mobile](http://jquerymobile.com/), a free and open source framework for creating mobile UIs that mimic the native look and feel of iOS application using HTML.

Because jQuery Mobile is a HTML UI framework this project uses a number of other frameworks:

* [Knockout](http://knockoutjs.com/) - a JavaScript MVVM framework.
* [Cordova (previously PhoneGap)](http://incubator.apache.org/cordova/) - which provides a mechanism for wrapping HTML / JavaScript applications so that they can be distributed via the Apple, Android and Windows marketplaces / app strores.
* [jQuery Mobile Metro Theme](http://sgrebnov.github.com/jqmobile-metro-theme/) - an open source jQuery Mobile metro theme for Windows Phone.

Building the Application
========================

We're using the [PhoneGap Build](https://build.phonegap.com/) service to produce binaries for each platform. Unfortunately it requires each project be hosted in it's own repository and that's not how this project is structured, so we've had to setup proxy repositories. The repositories that we use for testing can be found at -

* Android/iOS - [Repo](https://github.com/chrisprice/PropertyCross-jQM), [PhoneGap Build](https://build.phonegap.com/apps/258007/builds)
* Windows Phone - [Repo](https://github.com/chrisprice/PropertyCross-jQM-WindowsPhone), [PhoneGap Build](https://build.phonegap.com/apps/238693/builds)

The Android and Windows Phone binaries should install on your device without any problems but due to the way iOS works, the signed iOS builds will only work on our devices. If you want to test on iOS, you can setup your own PhoneGap Build app (for free!), point it at the github repository for iOS and finally configure it to use your own iOS developer certificate/distribution profile.

If you just want to test in a desktop or mobile browser then your in luck, as jQuery Mobile just uses HTML / JavaScript all the applications can be run as is in your browser. 


