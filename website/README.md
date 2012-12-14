# PropertyCross

Helping you select a cross-platform mobile framework.

* [Download the PropertyCross project](https://github.com/ColinEberhardt/PropertyFinderCrossPlatform/archive/master.zip)
* [View Project on github] (https://github.com/ColinEberhardt/PropertyFinderCrossPlatform)

- Social media buttons

# Introduction

Developers are now finding themselves having to author applications for a diverse range of mobile platforms (iOS, Android, Windows Phone, ...), each of which have their own 'native' development languages, tools and environment.

There is an ever growing list of cross-platform frameworks that allow you to minimise the cost and effort of developing mobile apps, but which to choose?

To help solve this problem PropertyCross presents a non-trivial application, for searching UK property listings, developed using a range of cross-platform technologies and frameworks. Our aim is to provide developers with a practical insight into the strengths and weaknesses of each framework.

<table>
  <tr>
    <th>Framework</th>
    <th>iOS</th>
    <th>Android</th>
    <th>Windows Phone</th>
  </tr>
  <tr>
    <th>Native</th>
    <td>Y</td>
    <td>~</td>
    <td>Y</td>
  </tr>
  <tr>
    <th>jQueryMobile</th>
    <td>Y</td>
    <td>~</td>
    <td>Y</td>
  </tr>
  <tr>
    <th>Xamarin / Mono</th>
    <td>Y</td>
    <td>Y</td>
    <td>Y</td>
  </tr>
  <tr>
    <th>Titanium</th>
    <td>Y</td>
    <td>Y</td>
    <td>n/a</td>
  </tr>
  <tr>
    <th>Adobe AIR</th>
    <td>~</td>
    <td>~</td>
    <td>n/a</td>
  </tr>
  <tr>
    <th>Sencha Touch</th>
    <td>~</td>
    <td>~</td>
    <td>n/a</td>
  </tr>
</table>

Y = implemented, x = not yet implemented, ~ = in progress, n/a = not supported by the framework

(potentially replace with a list of frameworks together with icons to illustrate coverage)

This project was heavily inspired by [TodoMVC](http://todomvc.com/), which allows comparison of JavaScript frameworks.

# Selecting a Framework

The APK and XAP files for the Android and Windows Phone versions of each framework are available within the project download. For iPhone you will have to build and sign the projects yourself in order to deploy them onto your own device.

Some of the frameworks deliver a native user interface, whereas others construct a native-like interface using HTML5 technologies. When selecting a framework it is important to test the end-user experience that the framework delivers and ensure you are happy with any compromises.

The code-sharing which can be realistically achieved with each framework varies considerably. To aid in this comparison there is a build script which produces code metrics for guidance. Although, as developers I am sure you are aware that [lines-of-code metrics are flawed](http://www.google.co.uk/search?hl=en&q=loc+count+flawed) ;-) 

It is also worth investing quite a bit of time familiarising yourself with tools provided by each framework. The cost and quality of these varies considerably.

# The Application

The app, which is implemented by each framework for each mobile platform, is a tool for searching UK property listings.  This application was selected because it is non-trivial, multi-screen and makes use of a number of device capabilities including page navigation, geolocation, storage and web services. 

# Get Involved

This project is hosted on github, and you are welcome to extend it.  There are a great many cross-platform frameworks that could be added to the current list (MoSync, Qt, RhoMobile, Marmelade, Corona, jQTouch, Kendo UI, ...), also, if you are interested in adding BlackBerry implementations of the currently supported frameworks, that would be a welcome addition. For more detailed notes on implementation see the [PropertyCross specifications](https://github.com/ColinEberhardt/PropertyFinderCrossPlatform/tree/master/specification).



`--------  seperate page ----------------`

## Native

### Overview

The native implementations of the PropertyCross application are included as a benchmark for comparison. These implementations illustrate the tools and technologies that are used for native development on each mobile platform. The native implementations also provide a target for the user experience that should be aimed for with the cross-platform frameworks, with the assumption being that the use of native implementation technologies will provide the best user experience.

The iOS application is built using Xcode, the Windows Phone application is built using Visual Studio together with the Windows Phone 7 SDKs, and the Android version is built using Eclipse.

### Screenshots

_see subfolders https://github.com/ColinEberhardt/PropertyFinderCrossPlatform/tree/master/website/screenshots/native_
_there are 4 screenshots per platform_

### Code sharing metrics

Note: There is no code shared between native implementations, therefore these metrics simply give a rough indication of the relative quantity of code within each native implementation.

_pie chart with 4 segments_

- Social media buttons?
- download / fork / github call to action?
- navigation, list all frameworks on each page so that they can easily navigate between them? - or just back navigation via logo perhaps?
- APK / XAP file download.

`--------  seperate page ----------------`


## Xamarin

### Overview

[Xamarin](http://xamarin.com/) have two commercial products, _MonoTouch_ for iOS development and _Mono for Android_. The Xamarin frameworks allow you to write applications using C# and the .NET framework. For each platform Xamarin provide bindings to the native platform APIs. As a result Xamarin applications make use of the native UI for each mobile platform. Xamarin do not provide a Windows Phone product because the C# and .NET code used for Android and iOS development is directly portable to Windows Phone.

The PropertyCross implementation makes use of the Model View Presenter (MVP) pattern in order to share as much UI logic as possible. The Model and Presenter code is shared across all three mobile platforms, with the View code, which makes use of native UI components, being distinct for each platform. This is reflected in the code-sharing statistics.

To view the code and detailed build steps, [see the github source](https://github.com/ColinEberhardt/PropertyFinderCrossPlatform/tree/master/Xamarin).

### Screenshots

_see subfolders ..._

### Code sharing metrics

_pie chart with 4 segments_



`--------  seperate page ----------------`


## jQuery Mobile

### Overview

[jQuery Mobile](http://jquerymobile.com) is a HTML5 framework which makes it easy to create websites that mimic the iOS look and feel. This is achieved by providing HTML that is marked up with various jQuery Mobile specific attributes, which is then processed to generate the final markup. Within PropertyCross jQuery Mobile is combined with [KnockoutJS](http://knockoutjs.com/), which provides a presentation model (MVVM), [RequireJS](http://requirejs.org/), for dependency management, and [Cordova / PhoneGap](http://phonegap.com/), which packages the HTML / JavaScript within a native wrapper for app-store deployment. Cordova also provides a set of APIs for accessing native phone functionalities which are not available via HTML specifications.

The JavaScript Model and ViewModel code is shared across all mobile platforms, whereas the HTML files, which make up the View, are specific for each platform. This allows the UI for each platform to be tailored to the requirements of each platform. The iOS version uses the out-of-the-box jQuery Mobile styles, whereas Windows Phone uses the [jquery-metro-theme](http://sgrebnov.github.com/jqmobile-metro-theme/) extensions to support the Metro UI style together with Windows Phone specific features such as the app-bar.

We were unable to find a suitable theme or plugin for the Android version, as a result, the Android version uses the iOS style.

To view the code and detailed build steps, [see the github source](https://github.com/ColinEberhardt/PropertyFinderCrossPlatform/tree/master/jQueryMobile).

### Screenshots

_see subfolders ..._

### Code sharing metrics

_pie chart with 4 segments_



## Titanium

[Appcelerator Titanium](http://www.appcelerator.com/) is a JavaScript-based development platform for iOS and Android development. The JavaScript code is compiled into a native code on each platform, and the UI for a Titanium application is entirely native. Titanium development uses the Titanium Studio IDE, and depending on your OS, the Android SDKs and Xcode are also required.

The Titanium APIs provide an abstraction layer for the Android and iOS UI elements, allowing you to write your view code against the Titanium abstraction. Although, there are some view concepts which have not been abstracted, meaning that developers have to write platform specific view code.

The Titanium version of the PropertyCross application uses the Model-View-ViewModel (MVVM) pattern, however, Titanium lacks a binding framework, so the View JavaScript code subscribes to the various ViewModel properties.

To view the code and detailed build steps, [see the github source](https://github.com/ColinEberhardt/PropertyFinderCrossPlatform/tree/master/titanium).

## Adobe Air

The [Adobe Integrated Runtime]((http://www.adobe.com/products/air.html) (AIR) is a cross-platform runtime for iOS and Android.  It allows you to develop using ActionScript (a objected-oriented, strongly typed relative of JavaScript) by providing  the Flash Player virtual machine to abstract away from the underlying hardware, with an extended API available to access device capabilities such as GPS and camera.  Furthermore, this allows developers to use the [Apache Flex](http://incubator.apache.org/flex/) enterprise application framework which provides its own UI components (and an associated UI framework), data binding, advanced data structures and other essential utilities.  Flex also introduces the MXML language for the declarative creation of user interfaces.
 
The PropertyCross implementation uses the Presentation Model with services following the Command Pattern.  For better separation of concerns, the [Spicelib Parsley](www.spicefactory.org/parsley) inversion-of-control framework providing, amongst other things, dependency injection and a messaging framework, was used.  All code is shared between platforms, with styling differences managed using media queries in the CSS stylesheet.

To view the code and detailed build steps, [see the github source](https://github.com/ColinEberhardt/PropertyFinderCrossPlatform/tree/master/air).

## Sencha Touch

[Sencha Touch](http://www.sencha.com/products/touch) is a framework for building cross-platform mobile application using HTML5 technologies.

 - What is the IDE? What does the code look like? 

To view the code and detailed build steps, [see the github source](https://github.com/ColinEberhardt/PropertyFinderCrossPlatform/tree/master/senchatouch2).


