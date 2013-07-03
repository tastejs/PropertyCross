#Delphi Implementation

Visit the *Delphi page* (this will be live shortly) on the PropertyCross website for screenshots and code sharing metrics.

##Introduction

Embarcadero Delphi is an integrated development environment for developing applications across a range of platforms. Applications are written using [Object Pascal](http://en.wikipedia.org/wiki/Object_Pascal) and the [FireMonkey](http://en.wikipedia.org/wiki/FireMonkey) UI framework. The latest release of Delphi XE4 is the first release of FireMonkey that supports mobile application development for the iOS platfom. Android support is currently in development.

Delphi applications are written using the Delphi XE IDE which has a graphical UI editor for iOS applications. Compilation requires a Mac computer with Xcode, with the Delphi IDE communication to the Mac via 'PAServer'. Applications written using Delphi present a fully native user interface.

##Building the Application

### Requirements

The property cross example code is designed to work with the following editions of Embarcadero's RAD Tools.

- RAD Studio XE4 (Pro or above) 
- Delphi XE4 Enterprise, Architect or Ultimate edition.

A trial version is available from the [Embarcadero website](http://www.embarcadero.com/products/delphi/downloads).

In addition to your development PC, you need the following to develop mobile applications for iOS:

- A Mac running OS X
- An iOS device, connected to your Mac by USB cable

See the [FireMonkey Prerequisites](http://docwiki.embarcadero.com/RADStudio/XE4/en/FireMonkey_Platform_Prerequisites) documentation.

You will need to ensure you have installed on the Mac

 - Xcode with Command line tools
 - PAServer (part of the install Delphi / RAD Studio install)

### Set-up

Configuration of the IDE ready for Mac and iOS development
You will also need to make sure that (if you want to deploy to the device) you have you device provisioned and accessible.  You will require your Apple developer account for this. If you have a device already provisioned for use with XCode then you should be good to go.

See the following guides

 - [Set up your development environment for Mac](http://docwiki.embarcadero.com/RADStudio/XE4/en/IOS_Tutorial:_Set_Up_Your_Development)
 - [Set up your development environment on Windows](http://docwiki.embarcadero.com/RADStudio/XE4/en/IOS_Tutorial:_Set_Up_Your_Development_Environment_on_Windows_PC)

  
More on the set-up available here (including code signing help):

http://docwiki.embarcadero.com/RADStudio/XE4/en/IOS_Mobile_Application_Development

### Running the project

Once your environment is configured open **PropertyCrossDelphi.proj** via **File > 
Open Project** in the IDE.

On your screen you should see the main form along with the Project Manager (top right)
 

Choose the build configuration and also target platform you desire from the Project Manager. Ensure that the PA Server is running on the Mac and your device is unlocked (if deploying to the device) and choose run without debugging  (or Ctrl+Shift+F9) from the top of the screen. The application will now run onto your device.

##Application Structure

 + `\assets` - icons and splashscreens used by PhoneGap, these are generated via the [PropertyCross build system](https://github.com/ColinEberhardt/PropertyCross/tree/master/build).
 + `\source` - the project sourcecode
