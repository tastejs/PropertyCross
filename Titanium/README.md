## Appcelerator Titanium

Appcelerator Titanium is a platform for developing mobile, tablet and desktop applications using web technologies.

# Pre-Requisites

To run this example you'll need to install Titanium Studio. Depending on your OS you'll then either be able to build the Android version or the Android and iPhone version.

# Opening the Project

Open Titatnium Studio, File, Import, General>Existing Projects into Workspace.

# Running on a Device

From within the App Explorer tab, Run, Android Device/iOS Device.

# Tips

* In order to target Android API level 14 (ICS) you'll need to modify the Python script called androidsdk.py which for me was installed at C:\Users\USERNAME\AppData\Roaming\Titanium\mobilesdk\win32\2.1.2.GA\android. Within the android_api_levels mapping add the following -

	11: 'android-3.0',
	14: 'android-4.0'
 
