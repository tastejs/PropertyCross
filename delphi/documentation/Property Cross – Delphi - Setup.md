Property Cross – Delphi implantation
====================================
The following shows how to setup and use the demo example for Property Cross created with Embarcadero’s Delphi and RAD Studio IDE.
  Requirements------------
The property cross example code is designed to work with the following editions of Embarcadero’s RAD Tools.*	RAD Studio XE4 (Pro or above) *	Delphi XE4 Enterprise, Architect or Ultimate edition.A trial version is available from the following URLhttp://www.embarcadero.com/products/delphi/downloads  
  Hardware and operating pre-requisites-------------------------------------In addition to your development PC, you need the following to develop mobile applications for iOS:*	A Mac running OS X*	An iOS device, connected to your Mac by USB cablehttp://docwiki.embarcadero.com/RADStudio/XE4/en/FireMonkey_Platform_Prerequisites You will need to ensure you have installed on the Mac*	Xcode with Command line tools*	PAServer (part of the install Delphi / RAD Studio install)Set-up
------
Configuration of the IDE ready for Mac and iOS developmentYou will also need to make sure that (if you want to deploy to the device) you have you device provisioned and accessible.  You will require your Apple developer account for this. If you have a device already provisioned for use with XCode then you should be good to go.http://docwiki.embarcadero.com/RADStudio/XE4/en/IOS_Tutorial:_Set_Up_Your_Development_Environment_on_the_Mac
 http://docwiki.embarcadero.com/RADStudio/XE4/en/IOS_Tutorial:_Set_Up_Your_Development_Environment_on_Windows_PC
  More on the set-up available here (including code signing help):http://docwiki.embarcadero.com/RADStudio/XE4/en/IOS_Mobile_Application_Development
If you wish to test your setup is correct then the following “hello world” tutorial is a good place to start. http://docwiki.embarcadero.com/RADStudio/XE4/en/IOS_Tutorial:_Creating_a_FireMonkey_iOS_Application
Running the project
-------------------

Once your environment is configured open PropertyCrossDelphi.proj via “File” > “Open Project” in the IDE.On your screen you should see the main form along with the Project Manager (top right) Choose the build configuration and also target platform you desire from the Project Manager. Ensure that the PA Server is running on the Mac and your device is unlocked (if deploying to the device) and choose run without debugging  (or Ctrl+Shift+F9) from the top of the screen. The application will now run onto your device.Example Screen Shots from the project-------------------------------------