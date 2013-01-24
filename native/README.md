Native PropertyCross
====================

These are the native implementations of the Property Finder application, included as reference. 

Building the Application
========================

The iOS version is built using XCode4.5, the Windows Phone version using Visual Studio and the Windows Phone 7.1 SDKs. 

Building the Android Application
================================
The native Android PropertyCross requires the following dependencies:

* The Android Support library, supplied in PropertyCross/libs/
* Version 2.1 of BitmapLruCache, supplied in PropertyCross/libs/
* ActionBarSherlock, which can be downloaded from http://actionbarsherlock.com. You will then need to make PropertyCross reference ActionBarSherlock as a library project in Eclipse:
** In Eclipse: Select File > Import > Existing Android code into workspace
** Navigate to where ActionBarSherlock was downloaded to, and select the library/ project.
** Right-click on the ActionBarSherlock project and select "Properties." In the "Android" section, ensure "Is Library" is selected.
** Right-click on the PropertyCross project and select "Properties." In the "Android" section, click "Add". Locate the ActionBarSherlock project.

Should ADT complain about a JAR mismatch between the version of the Android Support Library used by ActionBarSherlock and PropertyCross, take the version supplied in PropertyCross/libs and copy it into the ActionBarSherlock/libs folder. Should you need to do this, create a copy of ActionBarSherlock for this particular modification so other projects you may have remain unaffected.