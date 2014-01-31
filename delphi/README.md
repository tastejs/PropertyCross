#Delphi Implementation

Visit the [Delphi page](http://propertycross.com/delphi/) on the PropertyCross website for screenshots and code sharing metrics.

##Introduction

Embarcadero Delphi is an integrated development environment for developing applications across a range of platforms. Applications are written using [Object Pascal](http://en.wikipedia.org/wiki/Object_Pascal) and the [FireMonkey](http://en.wikipedia.org/wiki/FireMonkey) UI framework. The latest release of Delphi XE5 supports mobile development on both iOS and Android, as well as desktop platforms. 

Delphi applications are written using the Delphi XE5 IDE which has a graphical UI editor for mobile applications. Deployment to iOS requires tcp access to a Mac with the Xcode command-line tools, with the Delphi IDE communicating to the Mac via a 'PAServer' agent. Deployment to Android can all be done from Windows. Applications written using Delphi present a fully native user interface.

##Building the Application

### Requirements

The property cross example code is designed to work with the following editions of Embarcadero's RAD Tools.

- RAD Studio XE5 (Pro or above) 
- Delphi XE5 Enterprise, Architect or Ultimate edition.

A trial version is available from the [Embarcadero website](http://www.embarcadero.com/products/delphi/downloads).

#### Additional iOS Requirements 

In addition to your development PC, you need the following to develop mobile applications for iOS:

- A Mac running OS X
- An iOS device, connected to your Mac by USB cable

See the [FireMonkey Prerequisites](http://docwiki.embarcadero.com/RADStudio/en/FireMonkey_Platform_Prerequisites) documentation.

You will need to ensure you have installed on the Mac

 - Xcode with Command line tools
 - PAServer (part of the Delphi / RAD Studio install)
 
As mentioned above, for Android development no Mac is required.


### Set-up

There are step-by-step guides to setting up your development environment for iOS and Android development as part of the [Mobile Application Development Tutorials](http://docwiki.embarcadero.com/RADStudio/XE5/en/Mobile_Tutorials:_Mobile_Application_Development_(iOS_and_Android)

### Running the project

Once your environment is configured open **PropertyCrossDelphi.dproj** via **File > 
Open Project** in the IDE.

On your screen you should see the main form along with the Project Manager (top right)
 

Choose the build configuration and also target platform you desire from the Project Manager. If building for iOS, ensure that the PA Server is running on the Mac and your device is unlocked (if deploying to the device) and choose run without debugging  (or Ctrl+Shift+F9) from the top of the screen. The application will now run onto your device.

##Application Structure

 + `\assets` - icons and splashscreens used by PhoneGap, these are generated via the [PropertyCross build system](https://github.com/ColinEberhardt/PropertyCross/tree/master/build).
 + `\source` - the project sourcecode
