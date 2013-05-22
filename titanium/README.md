# Appcelerator Titanium

Visit the [Titanium page](http://propertycross.com/titanium/) on the PropertyCross website for screenshots and code sharing metrics.

## Introduction

[Appcelerator Titanium](http://www.appcelerator.com/) is a JavaScript-based development platform for iOS and Android development. The JavaScript code runs on the device within an interpreter, and the UI for a Titanium application is entirely native. Titanium development uses the Titanium Studio IDE, and depending on your OS, the Android SDKs and Xcode are also required.

The Titanium APIs provide an abstraction layer for the Android and iOS UI elements, allowing you to write your view code against the Titanium abstraction. Although, there are some view concepts which have not been abstracted, meaning that developers have to write platform specific view code.

The Titanium version of the PropertyCross application uses the Model-View-ViewModel (MVVM) pattern, however, Titanium lacks a binding framework, so the View JavaScript code subscribes to the various ViewModel properties.

## Building the Application

To run this example you'll need to install Titanium Studio, and depending on your OS the Android SDK and XCode (OSX only).

Open Titatnium Studio, then select: `File, Import, General>Existing Projects into Workspace`.

To run on a device, within the App Explorer tab select: `Run, Android Device/iOS Device`.

**NOTE:** In order to target Android API level 14 (ICS) you'll need to modify the Python script called `androidsdk.py` which for me was installed at` C:\Users\USERNAME\AppData\Roaming\Titanium\mobilesdk\win32\2.1.2.GA\android`. Within the android_api_levels mapping add the following -

        11: 'android-3.0',
        14: 'android-4.0'
 
##Application Structure

 + `\.settings` - Titanium Studio metadata files
 + `\platform` - TODO: document.
 + `\lib` - the various JavaScript frameworks used by this implementation
 + `\Resources\android` - Android app icon.
 + `\Resources\iphone` - iPhone app icon and images.
 + `\Resources\lib` - The JavaScript libraries that this project  uses, Knockout and underscore.
 + `\Resources\model` - The application model layer, includes the code that communicates with the Nestoria search APIs.
 + `\Resources\view` - JavaScript files that Titanium uses to describe the UI.
 + `\Resources\viewModel` - The view models that implement the PropertyCross logic.
 + `\Resources\app.js` - Application bootstrap.
 + `.project` - Titanium project file
 + `manifest` - Application manifest, used by the build process
 + `stats-config.json` - Used by the PropertyCross build in order to compute code sharing metrics.
 + `tiapp.xml` - Titanium [application configuration](http://developer.appcelerator.com/doc/desktop/tiapp.xml).

##Further Reading

 + [Converting an HTML5 App to a Native App with Titanium](http://www.scottlogic.co.uk/2012/10/converting-an-html5-app-to-a-native-app-with-titanium/) - Chris Price, who wrote the Titanium PropertyCross implementation, shares his experiences.

