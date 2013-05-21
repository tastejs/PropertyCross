# Lungo PropertyCross Implementation

Visit the [Lungo page](http://propertycross.com/lungo/) on the PropertyCross website for screenshots and code sharing metrics.

##Introduction

[Lungo](http://lungo.tapquo.com/) is a framework for developing cross-platform applications in HTML5. Lungo applications are run in the browser, similar to other HTML-based frameworks such as jQuery Mobile. Lungo provides 2 main workflows:

### Prototyping in Lungo

Lungo provides a rich set of classes to help decorate basic HTML5 markup. The markup is then given behaviour and interaction based on the structure by Lungo, without any developer code being required. Lungo's philosophy is that you should be able to create a prototype of your application to show basic interaction and page flow without having to write any JS yourself.

### Application Development in Lungo

Lungo also provides a JS API to interact and enhance the prototype. The Lungo API is similar to the common functionality you'd see in other mobile frameworks, such as DOM manipulation (through [Quo.js](http://quojs.tapquo.com/)), page routing and navigation, storage etc.

### Application

The application uses as much of the provided Lungo framework as possible. There are areas where we need to pull in some other libraries to ease the development process (similar to something you'd do in a real application). These application dependencies are:

 * [Knockout](http://knockoutjs.com/) as a MVVM framework.
 * [Require.js](http://requirejs.org/) as an AMD implementation.
 * [PhoneGap](https://build.phonegap.com/) as a native application wrapper.
 *  Maven as a build tool.
 
##Building the Application

Applications developed with Lungo can be run directly within a web browser control. 

The Lungo application is packaged using [PhoneGap Build](https://build.phonegap.com/), with the configuration specified in the `config.xml` file.

### Packaging
Packaging is done using PhoneGap Build. Communication with the PGB servers is done with the [Maven plugin](http://chrisprice.github.io/phonegap-build/phonegap-build-maven-plugin).

Ensure that your development environment is set up for PhoneGap build and
signing applications (follow the instructions on the plugin website, but this
really amounts to defining a PhoneGap build `server` in settings.xml and
obtaining an iOS/Android signing certificate.

Run the build with:
`mvn clean install -P phonegap-build`

##Application Structure

 + `\src\assets` - icons and splashscreens used by PhoneGap, these are generated via the [PropertyCross build system](https://github.com/ColinEberhardt/PropertyCross/tree/master/build).
 + `\src\components` - the various JS frameworks this implementation uses. The lungo folder includes both the JS and CSS for the framework
 + `\src\css` - the application specific styling.
 + `\src\models` - the model layer for this application, includes the code which communicates with the Nestoria APIs.
 + `\src\viewModels` - The view models that implement the PropertyCross logic.
 + `\src\application.js` - The application boot strap.
 + `\src\index.html` - Defines the various view for the application.
 + `config.xml` - The XML file that is used by PhoneGap 
 + `pom.xml` - The Maven POM file used to automate PhoneGap Build.
 + `stats-config.json` - Used by the PropertyCross build in order to compute code sharing metrics.

