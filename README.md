Cross Platform Property Finder
==============================

*... Helping you select a cross-platform mobile framework*

Introduction
-----------

Developers are increasingly finding themselves having to author applications for a diverse range of mobile devices
(iOS, Android, Windows Phone, BlackBerry, ...), each of which have their own 'native' development languages,
tools and environment. Cross platform technologies provide the potential to share skills and code,
making this an easier (and less costly) process.

Whilst HTML5 is the 'poster child' of cross platform mobile development, there are actually a large number of
alternative technologies out there, each with their own strengths and weaknesses. Some allow you to create
applications with a great user experience, but the development environment is a mess, while others offer little
scope for code re-use between devices.

To help solve this problem Cross-Platform-Property-Finder presents a non-trivial application, for searching
UK property listings, developed using a range of cross-platform technologies and frameworks. Our aim is to provide
developers with a practical insight into the strengths and weaknesses of each framework.

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
    <td>x</td>
    <td>x</td>
    <td>✔</td>
  </tr>
  <tr>
    <th>jQueryMobile</th>
    <td>✔</td>
    <td>x</td>
    <td>x</td>
  </tr>
  <tr>
    <th>Xamarin / MonoTouch</th>
    <td>✔</td>
    <td>x</td>
    <td>✔</td>
  </tr>
  <tr>
    <th>Titanium</th>
    <td>✔</td>
    <td>✔</td>
    <td>n/a</td>
  </tr>
</table>

✔ = implemented, x = not yet implemented, n/a = not supported by the framework

Platforms To Add:

  * RhoMobile
  * AppMobi
  * MoSync
  * Sencha Touch (with PhoneGap)
  * Kendo UI Mobile (with PhoneGap)

The Application
---------------

The app, which is implemented by each framework for each mobile platform, is tool for searching
UK property listings. This application was selected because it is non-trivial, multi-screen and
makes use of a number of device capabilities including page navigation, geolocation, storage and
web services.

The aim, when implementign this application with each framework, is to provide an application which:

 * Shares as much code as possible.
 * Is well structured and uses a UI design pattern, e.g. MVVM, MVC, MVP ...
 * Provides a user experience that is in keeping with each platform.

To expand on the last point, each mobile platform has its own identity - Android (Roboto),
Windows Phone (Metro), iOS (Apple / skeuomorphic). In order for an application to be well received by
its users, it is important that it 'fits' with other applications that alreayd exist on that platform.
For this reason, we feel that it is important thta a cross-platform framework can deliver a different, 
and appropriate experience on each platform.

Credits
-------

 * Native - Colin Eberhardt
 * PhoneGap / HTML5 - Colin Eberhardt / Chris Price
 * Xamarin - Colin Eberhardt
 * Titanium - Chris Price

