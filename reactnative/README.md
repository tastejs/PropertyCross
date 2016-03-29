#React Native Implementation

Visit the [React Native page](http://propertycross.com/reactnative/) on the PropertyCross website for screenshots.

##Introduction

[React Native](https://facebook.github.io/react-native/) enables you to build world-class application experiences on native platforms using a consistent developer experience based on JavaScript and React. The focus of React Native is on developer efficiency across all the platforms you care about — learn once, write anywhere. Facebook uses React Native in multiple production apps and will continue investing in React Native.

##Building the Application

###iOS

To produce an iOS build you will need to have access to a Mac with the latest version of XCode installed. The only setup the application needs is for an 'npm install' to be ran. Once this command has been ran a build can be produced by running the application within XCode.

###Android

In order to run this application on an Android device you will need to have the Android SDK installed. The Android SDK can be downloaded from http://developer.android.com/sdk/installing/index.html?pkg=tools. From within the SDK manager you will need to install ‘Android SDK Tools’, ‘Android SDK Platform Tools’, ‘Android SDK Build-tools’ and ‘Android SDK Platform 23’.

To create the Android project files run the 'react-native android' command in the project's main directory. To produce a build for the project you need to run the project's build.gradle. One way of doing this is by running it within [Android Studio](http://developer.android.com/sdk/installing/index.html?pkg=studio). You can import the project into Android Studio using the build.gradle file. Once the build.gradle has been ran it will produce apk files in the android/app/build/outputs/apk folder. These can be uploaded to a device or virtual device by using the adb install <apk-path> command.

##Relevant Links

This project is based on Colin Eberhardt's Property Finder. You can read about his experience writing Property Finder in [this blog](https://www.raywenderlich.com/99473/introducing-react-native-building-apps-javascript).
For more information about PropertyCross, visit [PropertyCross.com](http://www.propertycross.com).
For more information about React Native, visit [Facebook's information page](https://facebook.github.io/react-native/).

In addition, you might find the following resources useful to get started with React Native:
* <a href="https://discuss.reactjs.org/">Community Forum</a>
* <a href="https://facebook.github.io/react/blog/">Blogs</a>
* <a href="https://facebook.github.io/react-native/showcase.html">Showcase</a>
* <a href="https://facebook.github.io/react-native/support.html">Support</a>