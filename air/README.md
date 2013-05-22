#AIR PropertyCross

Visit the [AIR page](http://propertycross.com/air/) on the PropertyCross website for screenshots and code sharing metrics.

##Overview

This is an implementation of the PropertyCross application using Adobe Integrated Runtime (AIR), the SDK for which is freely available from [Adobe](http://www.adobe.com/devnet/air/air-sdk-download.html).  It also uses the Flex and Parsley frameworks, both of which are also freely available from [Apache](http://incubator.apache.org/flex/) and [Spicefactory](http://www.spicefactory.org/parsley/).

AIR allows you to develop Android and iOS applications using ActionScript.  It uses the Flash Player virtual machine (with an extended API) to abstract away from the underlying hardware, with access to device capabilities such as GPS and camera.  It also allows custom native extensions to be bundled and accessed through the virtual machine.

Flex is an enterprise application framework for the Flash Player virtual machine providing UI components (and an associated UI framework), binding, advanced data structures and other essential utilities.  It also introduces the MXML language to allow the declarative creation of user interfaces.

Parsley is an inversion-of-control framework for ActionScript providing amongst other things dependency injection and a messaging framework, allowing for better separation of concerns.

##Building the Application

To build the iOS or Android version you will need the AIR and Flex SDKs.  These provide the necessary libraries and a command-line compiler that can run on Windows, Mac or Linux.  Both iOS and Android builds of the application can be created on any platform.

The application code is structured using the Model View Presentation-Model pattern, with services separated using the command pattern and presentation models decoupled using [Parsley](http://www.spicefactory.org/parsley/)'s messaging framework.  All code is shared except for CSS styling (which differentiates between platforms using media queries). 

##Application Structure

 + '\libs' - binary dependencies for the use of [Parsley](http://www.spicefactory.org/parsley/)
 + '\src\PropertyCross.mxml' - the application root 
 + '\src\PropertyCross-app.xml' - the application manifest
 + '\src\com\propertycross\air\assets' - images and CSS stylesheet used by the application
 + '\src\com\propertycross\air\contexts' - [Parsley](http://www.spicefactory.org/parsley/) configurations for dependency injection
 + '\src\com\propertycross\air\controllers' - controllers for marshalling to and from persistence
 + '\src\com\propertycross\air\events' - custom event types used for [Parsley](http://www.spicefactory.org/parsley/) messaging
 + '\src\com\propertycross\air\models' - data models
 + '\src\com\propertycross\air\presentationModels' - presentation models implementing the PropertyCross logic
 + '\src\com\propertycross\air\renderers' - custom item renderers for list views
 + '\src\com\propertycross\air\services' - [Parsley](http://www.spicefactory.org/parsley/) managed commands for service abstraction
 + '\src\com\propertycross\air\views' - declarative views implementing the PropertyCross screens