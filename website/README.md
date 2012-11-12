# PropertyCross

Helping you select a cross-platform mobile framework.

# Introduction

Developers are increasingly finding themselves having to author applications for a diverse range of mobile devices (iOS, Android, Windows Phone, ...), each of which have their own 'native' development languages, tools and environment. Cross platform technologies provide the potential to share skills and code, making this an easier (and less costly) process.

Whilst HTML5 is the 'poster child' of cross platform mobile development, there are actually a large number of alternative technologies out there, each with their own strengths and weaknesses. Some allow you to create applications with a great user experience, but the development environment is a mess, while others offer little scope for code re-use between devices.

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
    <td>~</td>
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

(copied from ToDoMVC) Once you've downloaded the latest release and played around with the apps, you'll want to decide on a specific framework to try out.

Study the syntax required for defining models, views and (where applicable) controllers and classes in the frameworks you're interested in and try your hand at editing the code to see how it feels using it first-hand.

Please ensure that if you're happy with this, you do spend more time investigating the framework (including reading the official docs, the source and its complete feature list). There's often a lot more to a framework than what we present in our examples. (end - copied from ToDoMVC) 

# The Application

(reduce an listify)

The app, which is implemented by each framework for each mobile platform, is a tool for searching UK property listings. This application was selected because it is non-trivial, multi-screen and makes use of a number of device capabilities including page navigation, geolocation, storage and web services.

The aim, when implementing this application with each framework, is to provide an application which:

 * Shares as much code as possible.
 * Is well structured and uses a UI design pattern, e.g. MVVM, MVC, MVP ...
 * Strictly adheres to the UI guidelines of each platform (where possible).


# Get Involved

(reword to make more inviting - use words like 'extend')

We welcome community contributions to this project. There are a great many cross-platform frameworks that could be added to the current list, including RhoMobile, AppMobi, MoSync, Kendo UI Mobile, DXTREME, Moscrif ... If you want to add an implementation, just fork this project and have a go! Also, if you are interested in adding BlackBerrty implementations of the currently supported frameworks, that would be great!

- Social media buttons
- Fork me on github


# Application Details

## Native

### Overview

The native implementations of the PropertyCross application are included as a benchmark for comparison. These implementations illustrate the tools and technologies that are used for native development for each mobile platform. The native implementations also prvide a target for the user experience that should be aimed for with the cross-platform frameworks, with the assumption being that the use of natvie implementation technologies will provide the best usre experience.

The iOS application is built using Xcode, the Windows Phone application is built using Visual Studio together with the Windows Phone 7 SDKs, and the Android version is built using ...

### Screenshots

_see subfolders ..._

### Code sharing metrics

Note: There is no code shared between native implementations, therefore these metrics simply give a rough indication of the relative quantity of code within each native implementation.

<table>
  <tr>
    <th>Component</th>
    <th>Bytes</th>
    <th>%age</th>
  </tr>
  <tr>
    <th>Android</th>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <th>Windows Phone</th>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <th>iOS</th>
    <td>-</td>
    <td>-</td>
  </tr>
</table>

## Xamarin

### Overview

[Xamarin](http://xamarin.com/) have two commercial products, _MonoTouch_ for iOS development and _Mono for Android_. The Xamarin frameworks allow you to write applications using C# and the .NET framework. For each platform Xamarin provide bindings to the native platform APIs. As a result Xamarin applications make use of the native UI for each mobile platform. Xamarin do not provide a Windows Phone product because the C# and .NET code used for Android and iOS development is natively portable to Windows Phone.

The PropertyCross implementation makes use of the Model View Presenter (MVP) pattern in order to share as much UI logic as possible. The Model and Presenter code is shared across all three mobile platforms, with the View code, which makes use of native UI components, being distinct for each platform. This is reflected in the code-sharing statistics.

To view the code and detailed build steps, [see the github source](https://github.com/ColinEberhardt/PropertyFinderCrossPlatform/tree/master/Xamarin).

### Screenshots

_see subfolders ..._

### Code sharing metrics

<table>
  <tr>
    <th>Component</th>
    <th>Bytes</th>
    <th>%age</th>
  </tr>
  <tr>
    <th>Common</th>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <th>Android</th>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <th>Windows Phone</th>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <th>iOS</th>
    <td>-</td>
    <td>-</td>
  </tr>
</table>

- social media buttons
- download / fork / github call to action
- navigation, list all frameworks on each page so that they can easily navigate between them? - or just back navigation via logo perhaps?
- APK / XAP file download.

## jQuery Mobile

### Overview

[jQuery Mobile](http://jquerymobile.com) is a HTML5 framework which makes it easy to crete websites that mimic the iOS look and feel. This is achieved by providing HTML that is marked up with various jQuery Mobile specific attributes, which is then processed to generate the final markup. Within PropertyCross jQuery Mobile is combined with [KnockoutJS](http://knockoutjs.com/), which provides a presentation model (MVVM), [RequireJS](http://requirejs.org/), for dependency management, and [Cordova / PhoneGap](http://phonegap.com/), which packages the HTML / JavaScript within a native wrapper for app-store deployment. Cordova also provides a set of APIs for accessing native phone functionality which is not available via HTML5 specifications.

The JavaScript Model and ViewModel code is shared across all mobile platforms, whereas the HTML files, which make up the View, are specific for each platform. This allows the UI for each platform to be tailored to the requirements of each platform. The iOS version uses the out-of-the-box jQuery Mobile styles, whereas Windows Phone uses the [jquery-metro-theme](http://sgrebnov.github.com/jqmobile-metro-theme/) extensions to support the Metro UI style together with Windows Phone specific features such as athe app-bar.

To view the code and detailed build steps, [see the github source](https://github.com/ColinEberhardt/PropertyFinderCrossPlatform/tree/master/jQueryMobile).

### Screenshots

_see subfolders ..._

### Code sharing metrics

<table>
  <tr>
    <th>Component</th>
    <th>Bytes</th>
    <th>%age</th>
  </tr>
  <tr>
    <th>Common</th>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <th>Android</th>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <th>Windows Phone</th>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <th>iOS</th>
    <td>-</td>
    <td>-</td>
  </tr>
</table>



## Titanium
