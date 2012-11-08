# Introduction

Developers are increasingly finding themselves having to author applications for a diverse range of mobile devices (iOS, Android, Windows Phone, ...), each of which have their own 'native' development languages, tools and environment. Cross platform technologies provide the potential to share skills and code, making this an easier (and less costly) process.

Whilst HTML5 is the 'poster child' of cross platform mobile development, there are actually a large number of alternative technologies out there, each with their own strengths and weaknesses. Some allow you to create applications with a great user experience, but the development environment is a mess, while others offer little scope for code re-use between devices.

To help solve this problem PropertyCross presents a non-trivial application, for searching UK property listings, developed using a range of cross-platform technologies and frameworks. Our aim is to provide developers with a practical insight into the strengths and weaknesses of each framework.

The Apps
--------
<table>
  <tr>
    <th>Framework</th>
    <th>iOS</th>
    <th>Android</th>
    <th>Windows Phone</th>
  </tr>
  <tr>
    <th>Native</th>
    <td>?</td>
    <td>~</td>
    <td>?</td>
  </tr>
  <tr>
    <th>jQueryMobile</th>
    <td>?</td>
    <td>~</td>
    <td>?</td>
  </tr>
  <tr>
    <th>Xamarin / Mono</th>
    <td>?</td>
    <td>~</td>
    <td>?</td>
  </tr>
  <tr>
    <th>Titanium</th>
    <td>?</td>
    <td>?</td>
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

? = implemented, x = not yet implemented, ~ = in progress, n/a = not supported by the framework

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

Xamarin have two commercial products, _MonoTouch_ for iOS development and _Mono for Android_. The Xamarin frameworks allow you to write applications using C# and the .NET framework. For each platform Xamarin provide bindings to the native platform APIs. As a result Xamarin applications make use of the native UI for each mobile platform. Xamarin do not provide a Windows Phone product because the C# and .NET code used for Android and iOS development is natively portable to Windows Phone.

The PropertyCross implementation makes use of the Model View Presenter (MVP) pattern in order to share as much UI logic as possible. The Model and Presenter code is shared across all three mobile platforms, with the View code, which makes use of native UI components, being distinct for each platform. This is reflected in the code-sharing statistics.

For build instructions see: https://github.com/ColinEberhardt/PropertyFinderCrossPlatform/tree/master/Xamarin

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

## jQuery Mobile

### Overview

jQuery Mobile is a HTML5 framework which makes it easy to crete websites that mimic the iOS look and feel. This is achieved by providing HTML that is marked up with various jQuery Mobile specific attributes, which is then processed to genearte the final markup. Within PropertyCross jQuery Mobile is combined with KnockoutJS, which provides a presentation model (MVVM), RequireJS, for dependency management, and Cordova / PhoneGap, which packages the HTML / JavaScript within a native wrapper for app-store deployment. Cordova also provides a set of APIs for accessing native phone functionality which is not available via HTML5 specifications.


## Titanium
