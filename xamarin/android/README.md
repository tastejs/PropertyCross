Xamarin Android PropertyCross
=============================
This is an Android deployment of PropertyCross, build using the Xamarin MonoDroid project. It is compatible with all Android devices based on Eclair (2.1) upwards.

Google's [Android Support Library](https://developer.android.com/tools/extras/support-library.html) and [ActionBarSherlock](http://actionbarsherlock.com/) are used by this project to provide a consistent experience across all compatible Android devices. Note that the PropertyCross.sln file includes a custom ActionBarSherlock project, which generates C# bindings of the jar file and associated resources.

Building the Application
========================
To build the application within MonoDevelop, change the profile to "Release". You will also want to remove the android:debuggable="true" statement in AndroidManifest.xml. From the "Project" menu, select "Create Android Package". This will output a .apk file to a location of your choice. This can then be dragged and dropped onto a physical device and installed by browsing to the file with a File Manager application.

For security reasons, installing applications from anywhere other than Google Play is disabled by default. This can be overridden at your own risk by Selecting "Unknown sources" from the Security submenu in Settings.

Debugging the Application
=========================
A premium license is required to debug an application on a physical device. 
To correctly enable debugging on your device, enable "USB debugging" within Developer Options.

If you are not in possession of a premium license, it is possible to use Android emulators (which are set up using the SDK manager application) to debug the application.