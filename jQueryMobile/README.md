jQuery Mobile PropertyCross
==========================

This is an implementation of the PropertyCross application using jQuery Mobile, a free and open source framework for creating mobile UIs
that mimic the native look and feel of iOS application using HTML.

http://jquerymobile.com/

Because jQuery Mobile is a HTML UI framework this project uses a number of other frameworks:

http://knockoutjs.com/ - Knockout, a JavaScript MVVM framework.
http://incubator.apache.org/cordova/ - Cordova (previously PhoneGap), which provides a mechanism for wrapping HTML / JavaScript applications so that they can be distributed
via the Apple, Android and Windows marketplaces / app strores.
http://sgrebnov.github.com/jqmobile-metro-theme/ - an open source jQuery Mobile metro theme for Windows Phone.

Building the Application
========================

Because jQuery Mobile uses HTML / JavaScript all the various applications can be run within a desktop or mobile browser. In order
to build the application for the app store you can use the PhoneGap Build (https://build.phonegap.com/) service. Each version
of the application has a config.xml file which PhoneGap Build uses to configure the application.

PhoneGap Build can host public projects if each build is hosted in it's own Github public repository. Unfortunately that's not how this project is structured so it's neccessary to use proxy repositories. Instructions for doing this along with example repositories can be found at -

* [iOS Version](https://github.com/chrisprice/PropertyCross-jQM-iOS)
* [Windows Phone Version](https://github.com/chrisprice/PropertyCross-jQM-WindowsPhone)



