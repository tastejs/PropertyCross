#Qt PropertyCross

Visit the [Qt page](http://propertycross.com/qt/) on the PropertyCross website for screenshots and code sharing metrics.

##Introduction

This is an implementation of the PropertyCross application using the [Qt Framework](http://www.qt.io/), a free Framework for Cross-Platform program development - including, but not limited to mobile platforms.
There is also a paid version of Qt.

From the [Qt](http://www.qt.io/) Website: "We make cross-platform application development easy. Target all the screens in your end users’ lives. You only need to write and maintain one code base regardless of what kind of and how many target platforms you might have and we’re talking about all major operating systems here. No need for separate implementations for different user devices. Qt makes your time-to-market faster, technology strategy simpler and future-proof, consequently reducing
costs."

In spirit with this description the Author of the Qt-port did not extensively customize the appearaence of the basic UI-types (Button, ListView, ...) but rather let Qt do its' best to present the User with as much a native look as possible. 
This leads to all the platforms looking very Android-like at the time of writing, using Qt5.5.
However, it would be possible to further style the Qml-Types to look more native and the authors have presented one way to doing so using a Singleton "AppStyle.qml" in conjunction with a [QQmlFileSelector](,http://doc.qt.io/qt-5/qqmlfileselector.html) which sofar only changes the color of the TitleBar according to the platform the App runs on.

Addendum: At the time of this writing (September 22nd of 2015), we lack the pictures for the Windows Platform, due to some internal issues, but we had the App running on a Windows Phone before and are planning to add those picture shortly.

This port was developed by [BBV Software Services AG](http://www.bbv.ch) and is released as is and without ANY warranties as Open Source.

##Building the Application

The App can be built using either the [QtCreator](http://www.qt.io/ide/) (easiest) or using qmake directly.

Up on loading the Main Project file (PropertyCross.pro) QtCreator should - if all [prerequisites](http://doc.qt.io/qtcreator/creator-mobile-app-tutorial.html) have been fulfilled - preset you with a list of possible platforms to build the App for. 

##Application Structure

+ `\PropertyCrossApp.pro` - Main Project File for The Qt-App
+ `\PropertyCrossApp` - All essential part of the App, mostly Qml files and the main.cpp for the App
+ `\PropertyCrossApp\android` - Additional files used by Qt for generating the Android applicaiton
+ `\PropertyCrossApp\IOs` - Additional files used by Qt for generating the IOs applicaiton
+ `\PropertyCrossApp\qml` - All Qml-Files the App uses
+ `\PropertyCrossApp\res` - Additional image-resources the App uses
+ `\PropertyCrossApp\src` - The main.cpp of the App lies herein
+ `\PropertyCrossLib` - Helper Classes for the App
+ `\PropertyCrossTest` - Tests for the Helper Classes - all tests should succeed

##Known bugs
+ During development pictures did sometimes not load properly, we couldn't figure out if this was due to our Internet connection or because of Qt. 
+ On IOs and Windows Phone the App doesn't look native - this is because Qt doesn't seem to properly style the Items according to native looks


