# Codename One Implementation

Visit the [Codename One article](https://www.codenameone.com/blog/property-cross-revisited.html) on the property cross demo and the [demo page in the website](https://www.codenameone.com/demos-PropertyCross.html) to learn more.

## Introduction

<img align="right" width="400px" src="https://www.codenameone.com/img/property-cross.png" alt="Property Cross">

[Codename One](https://www.codenameone.com) is an open source framework that lets Java developers build native apps for mobile devices. It's chief goal is to bring Java style WORA (Write Once Run Anywhere) into mobile development by leveraging a "Swing like" architecture.

[Codename One](https://www.codenameone.com) has ports for iOS, Android, Windows Phone (defunct), Universal Windows Platform (UWP - Windows 10/Mobile), JavaScript (with threads), Desktop (Mac/Windows) & RIM. It uses a cloud build system to convert the Java bytecode to native code and thus removes the need for a Mac machine or a Windows Machine (for UWP/Windows Phone) notice that [offline build](https://www.codenameone.com/blog/offline-build.html) is also supported.

You can read more about Codename One and its architecture in its [developer guide](https://www.codenameone.com/manual/).


## Building The application

You first need to install Codename One which is available for all 3 top Java IDE's (NetBeans, Eclipse & IntelliJ/IDEA). You can read the instructions [here](https://www.codenameone.com/download.html).

### The Really Easy Way

You can create a local version of this demo by using the new project wizard in the IDE and selecting:

`Codename One -> Demos -> Property Cross`.

### Building From Scratch

The project included is for NetBeans so you will need to install Codename One on top of NetBeans. You can open the project and update the missing jar resources from a newly created project.


## Application Structure

The application is a simple yet typical Codename One/NetBeans application, it has the following directories/files of interest:

- `build.xml` - ant build file used for the build scripts launched from the IDE.

- `src` - the full source of the application and its required resources.

- `src/theme.res` - theme and resource file containing a portable represntation of data.

- `icon.png` - a 512x512 icon that is automatically adapted to all device resolutions.

- `native` - this is unused for this demo as Property Cross doesn't require any native functionality. However, it can contain device specific native OS code if required.

- `lib` - contains basic libraries required as well as plugins/extensions. This demo doesn't need any libraries or extensions at this point so the lib directory has the default value.

## Further Reading

- [Codename One Developer Guide](https://www.codenameone.com/manual/)

- [JavaDocs](https://www.codenameone.com/javadoc/) - reference guide to Codename One methods/classes

- [Learn Mobile Programing by Examplw with Codename One](https://www.udemy.com/learn-mobile-programming-by-example-with-codename-one/) - a free Udemy course that covers an older version of this demo.
