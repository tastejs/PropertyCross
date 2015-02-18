# Appcelerator Titanium

Visit the [Titanium page](http://propertycross.com/titanium/) on the PropertyCross website for screenshots and code sharing metrics.

## Introduction

[Appcelerator Titanium](http://www.appcelerator.com/titanium) is a JavaScript-based development platform for iOS and Android development. The JavaScript code runs on the device within an interpreter, and the UI for a Titanium application is entirely native. Titanium development uses the Titanium Studio IDE, and depending on your OS, the Android SDKs and Xcode are also required.

The Titanium APIs provide an abstraction layer for the Android and iOS UI elements, allowing you to write your view code against the Titanium abstraction. Platform specific view concepts have not been abstracted and are available under their own namespaces.

[Appcelerator Alloy](http://www.appcelerator.com/alloy) is the official MVC for Titanium. It uses XML for views and CSS-like TSS for styles. Controllers use BackBone. Alloy compiles to a classic Titanium project before Titanium compiles to a native app. This way, the developer can take advantage of MVC without having to worry about adding any overhead.

## Building the Application

To run this example you'll need to install Titanium Studio, and depending on your OS the Android SDK and XCode (OSX only).

Open Titatnium Studio, then select: `File, Import, General>Existing Projects into Workspace`.

To run on a device, within the App Explorer tab select: `Run, Android Device/iOS Device`.
 
##Application Structure

 + `\app` - [Alloy MVC](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Framework)
 + `\app\controllers` - Alloy [controllers](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Controllers)
 + `\app\styles` - Alloy controller [styles](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Styles_and_Themes)
 + `\app\styles\app.tss` - Alloy global styles
 + `\app\views` - Alloy [views](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Views)
 + `\app\models` - Alloy [models](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Models)
 + `\app\lib` - Helper libraries
 + `\app\lib\alloy\sync\nestoria.js` - [Custom Alloy sync adapter](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Sync_Adapters_and_Migrations-section-36739597_AlloySyncAdaptersandMigrations-CustomSyncAdapters) for Nestoria
 + `\app\widgets` - Alloy [widgets](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Widgets)
 + `\app\assets` - Assets
 + `\app\assets\iphone` - iPhone specific assets
 + `\app\assets\android` - Android specific assets
 + `\platform\android` - Android specific assets (stored under Android.R)
 + `\plugins` - Titanium plugins (hooking up Alloy)
 + `\Resources` - Where Alloy will compile to as classic project
 + `\.settings` - Titanium Studio metadata files
 + `.project` - Titanium Studio project file
 + `manifest` - Application manifest, used by the build process
 + `tiapp.xml` - Titanium [application configuration](http://developer.appcelerator.com/doc/desktop/tiapp.xml).
 + `*.png` - Assets generated from `icon.png` and `splash.png` using [tiCons](http://ticons.fokkezb.nl)
 + `stats-config.json` - Used by the PropertyCross build in order to compute code sharing metrics.

##Further Reading

 + [Rewriting PropertyCross in Titanium Alloy]() - Fokke Zandbergen, who rewrote the Titanium PropertyCross implementation using Alloy MVC, shares his experiences.

