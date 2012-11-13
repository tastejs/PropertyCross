AIR PropertyCross
=================

This is an implementation of the PropertyCross application using Adobe Integrated Runtime (AIR), the SDK for which is freely 
available from [Adobe](http://www.adobe.com/devnet/air/air-sdk-download.html).  It also uses the Flex and Parsley frameworks, 
both of which are also freely available from [Apache](http://incubator.apache.org/flex/) and [Spicefactory](http://www.spicefactory.org/parsley/).

AIR allows you to develop Android and iOS applications using ActionScript.  It uses the Flash Player virtual
machine (with an extended API) to abstract away from the underlying hardware, with access to device capabilities such as 
GPS and camera.  It also allows custom native extensions to be bundled and accessed through the virtual machine.

Flex is an enterprise application framework for the Flash Player virtual machine providing UI components (and an associated UI
framework), binding, advanced data structures and other essential utilities.  It also introduces the MXML language to allow 
the declarative creation of user interfaces.

Parsley is an inversion-of-control framework for ActionScript providing amongst other things dependency injection and a messaging
framework, allowing for better separation of concerns.


Building the Application
========================

To build the iOS or Android version you will need the AIR and Flex SDKs.  These provide the necessary libraries and a command-line
compiler that can run on Windows, Mac or Linux.  Both iOS and Android builds of the application can be created on any platform.

The application code is structured using the Model View Presentation-Model pattern, with services separated using the command 
pattern.  All code is shared except for CSS styling (which differentiates between platforms using media queries). 

