---
layout: framework
title: jQuery Mobile
framework: jquerymobile
platforms:
- android
- ios
- windowsphone
pie:
  windowsphone: { segment: 'M150,150l0.0,-145.0A145,145,0,0,1,294.1,133.5z', line: 'M150,150l144.1,-16.5' }
  common: { segment: 'M150,150l144.1,-16.5A145,145,0,1,1,150.0,5.0z', line: 'M150,150l-0.0,-145.0' }
  notes: The common code includes some code that is shared between the Android and iOS versions but is excluded from the Windows Phone version.
---
[jQuery Mobile](http://jquerymobile.com) is a HTML5 framework which makes it easy to create websites that mimic the iOS look and feel. This is achieved by providing HTML that is marked up with various jQuery Mobile specific attributes, which is then processed to generate the final markup. Within PropertyCross jQuery Mobile is combined with [KnockoutJS](http://knockoutjs.com/), which provides a presentation model (MVVM), [RequireJS](http://requirejs.org/), for dependency management, and [Cordova / PhoneGap](http://phonegap.com/), which packages the HTML / JavaScript within a native wrapper for app-store deployment. Cordova also provides a set of APIs for accessing native phone functionalities which are not available via HTML specifications.

The JavaScript Model and ViewModel code is shared across all mobile platforms, whereas the HTML files, which make up the View, are specific for each platform. This allows the UI for each platform to be tailored to the requirements of each platform. The iOS version uses the out-of-the-box jQuery Mobile styles, whereas Windows Phone uses the [jquery-metro-theme](http://sgrebnov.github.com/jqmobile-metro-theme/) extensions to support the Metro UI style together with Windows Phone specific features such as the app-bar.

We were unable to find a suitable theme or plugin for the Android version, as a result, the Android version uses the iOS style.

To view the code and detailed build steps, [see the github source]({{ site.githuburl }}/tree/master/jQueryMobile).