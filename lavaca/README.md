Lavaca PropertyCross
======

An implementation of the PropertyCross app using Lavaca.

##Introduction

[Lavaca](http://getlavaca.com) is a web application framework designed to jumpstart development of hybrid and single page applications. Lavaca is made available under an MIT licence and features:

* An AMD architecture utilizing ([require.js](http://requirejs.org/))
* A build system leveraging ([Grunt](http://gruntjs.com/))
* A JavaScript MVC framework -> [learn more](3.0.-MVC-in-Lavaca)
* Integration with [Cordova / PhoneGap](http://phonegap.com) out-of-the-box
* A JavaScript documentation generation system ([YUIDoc](http://yui.github.io/yuidoc/))
* A unit testing framework ([Jasmine](http://pivotal.github.io/jasmine/))
* A templating framework ([LinkedIn fork of Dust](http://linkedin.github.com/dustjs/))
* A translation framework
* Dynamic CSS with ([LESS](http://lesscss.org/))
* ...as well as many other common components.

The Lavaca implementation of PropertyCross is built for iOS, Android, and Web. All platforms share the same HTML/CSS/JavaScript. Due to lack of demand, Lavaca does not official support Windows Phone 8, however this project could be modified to support Windows Phone 8. 

## Building the Application

```bash
$ # Go to "lavaca" directory
$ cd lavaca

$ # Install grunt-cli globally - this may require sudo
$ npm install -g grunt-cli

$ # Install bower globally - this may require sudo
$ npm install -g bower

$ # Install node dependencies for
$ npm install

$ # Install bower dependencies
$ bower install
```

### Run Development Server

```bash
$ grunt server
```

Your application should now be running on `localhost:8080`.

### Build for Deployment

```bash
$ grunt build:production
```

This task creates a build directory with the Web code ready for deployment. The iOS and Android code projects are in `cordova/platforms`.

### Package Builds for Native Deployment

```bash
$ grunt pkg
```

or

```bash
$ grunt pkg:ios
```

or

```bash
$ grunt pkg:android
```

### Performing Deployment
libimobiledevice is required to install and uninstall packages to/from iOS devices. Mac OS X users may use [https://github.com/benvium/libimobiledevice-macosx](https://github.com/benvium/libimobiledevice-macosx).
adb is required to install and uninstall packages to/from Android devices.

For more help with building see [Building Your Project](https://github.com/mutualmobile/lavaca/wiki/2.1.-Building-Your-Project).

## Application Structure

See [Project Structure](http://getlavaca.com/#/guide/Project-Structure#@10) from the Lavaca wiki.