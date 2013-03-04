## mgwt PropertyCross

[Google Web Toolkit](https://developers.google.com/web-toolkit/)  (GWT) is an open source set of tools that allows developers to create web apps in Java. GWT compiles Java into an optimised JavaScript application. GWT is most often used for large-scale web applications, with the strongly typed nature of Java making it easier to maintain a large codebase.

[mgwt](http://www.m-gwt.com/) is an open source mobile widget framework build using GWT. mgwt provides a number of UI widgets, CSS styles and a PhoneGap API which make it easier to develop native-like applications using GWT.

The mgwt PropertyCross implementation is structured using the popular GWT ['Activities and Places'](https://developers.google.com/web-toolkit/doc/latest/DevGuideMvpActivitiesAndPlaces) pattern.

## Build Instructions

* To build this project you'll first need [Maven](http://maven.apache.org/) installed.
* The tests for this project depend on a jar not found in maven central so you'll need to manually install it first by running -
`mgwt> mvn install:install-file -Dfile=lib/easy-gwt-mock.jar -DgroupId=com.propertycross.mgwt -DartifactId=easy-gwt-mock -Dversion=e15d9a93fd52 -Dpackaging=jar`
* Then run -
`mgwt> mvn clean install`

## Developing with Eclipse

* Ensure you have the [Eclipse plugin](https://developers.google.com/web-toolkit/download) installed
* Create an 'empty' project pointing it at the directory with the mgwt code
* Configure => Convert to Maven Project ...
* Google => Web Toolkit Settings ... - Check the "Use Google Web Toolkit" checkbox

