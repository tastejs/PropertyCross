#React Native Implementation

Visit the [React Native page](http://propertycross.com/reactnative/) on the PropertyCross website for screenshots.

##Introduction

[React Native](https://facebook.github.io/react-native/) enables development of iOS and Android applications using the 'React' Javascript framework. The framework provides built-in Javascript components which are backed by actual native Android and iOS components that give the app a very convincing native feel.
React Native development focuses around the idea of 'Learn once, write anywhere'. The idea comes from being able to write platform specific UIs without having to learn a fundamentally different set of technologies to develop for each platform.

##Building the Application

###iOS

To produce an iOS build you will need to have access to a Mac with the latest version of XCode installed. The only setup the application needs is for an 'npm install' to be ran. Once this command has been ran a build can be produced by running the application within XCode.

###Android

To run this application on an Android device you will need to have the Android SDK installed. The Android SDK can be downloaded from http://developer.android.com/sdk/installing/index.html?pkg=tools. In the SDK manager you will need to install ‘Android SDK Tools’, ‘Android SDK Platform Tools’, ‘Android SDK Build-tools’ and ‘Android SDK Platform 23’. The next step is to create the Android project files by running the 'react-native android' command in the project's main directory and to download the project's dependencies which can be done by running the 'npm install' command.

To produce a build for the project you need to run the project's build.gradle. The build.gradle file can be found in the 'android' folder which is generated using the 'react-native android' command. One way of building the project using this file is by running it within [Android Studio](http://developer.android.com/sdk/installing/index.html?pkg=studio). You can import the project into Android Studio using the build.gradle file. Once the build.gradle file has been ran it will produce apk files in the android/app/build/outputs/apk folder. These can be uploaded to a device or virtual device by using the adb install <apk-path> command.

##Relevant Links

This project is based on Colin Eberhardt's Property Finder. You can read about his experience writing Property Finder in [this blog](https://www.raywenderlich.com/99473/introducing-react-native-building-apps-javascript).
For more information about PropertyCross, visit [PropertyCross.com](http://www.propertycross.com).
For more information about React Native, visit [Facebook's information page](https://facebook.github.io/react-native/).

In addition, you might find the following resources useful to get started with React Native:
* <a href="https://discuss.reactjs.org/">Community Forum</a>
* <a href="https://facebook.github.io/react/blog/">Blogs</a>
* <a href="https://facebook.github.io/react-native/showcase.html">Showcase</a>
* <a href="https://facebook.github.io/react-native/support.html">Support</a>

##Application Structure

+ `package.json`
+ `Favourites.js` - Page responsible for displaying favourited properties
+ `SearchPage.js` - The first page displayed by the application. Enables a user to search for properties
+ `SearchResults.js` - The page responsible for displaying a list of searches
+ `PropertyView.js` - Responsible for showing details of an individual property
+ `index.android.js` - The Android specific 'host' page for the application
+ `index.ios.js` - The iOS specific 'host' page for the application
+ `package.json`
+ `\iOS` - The auto-generated iOS project files
  + `\PropertyCross.xcodeproj` - The iOS project file
+ '\android' - The auto-generated Android project files. This folder is generated after running the 'react-native android' command in the project's root folder
  + 'build.gradle' - The gradle file that's used to build the Android project