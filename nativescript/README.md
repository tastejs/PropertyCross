#NativeScript implementation with Angular 2

Visit the [NativeScript page](http://propertycross.com/nativescript/) on the PropertyCross website for screenshots.

##Introduction

[NativeScript](https://www.nativescript.org/) is a framework to develop truly native apps for iOS and Android from a single code base of JavaScript or TypeScript, XML and CSS.
NativeScript takes the cross-platform code and translates it into the language that the target platform speaks.
Using the NativeScript/Angular2 bridge the features of NativeScript and Angular2 can be combined to write Angular2 components for mobile platforms.

##Building the Application

Install your native toolchain and NativeScript as described in the docs:

https://docs.nativescript.org/setup/quick-setup

Then install the needed NPM packages:

```
$ npm install
```

###Add your chosen platform

```
$ tns platform add android
$ tns platform add ios
```

###Run in emulator

```
$ tns run android --emulator
$ tns run ios --emulator
```

##Application Structure
+ `package.json`
+ `\app`
  + `app.css` - the styles for the application.
  + `config.ts`
  + `main.ts` - the application boot strap and global dependency injection.
  + `property-cross.ts` - the main application class, setting up the routing.
  + `\App_Resources` - icons used by the app,
  + `\components` - the Angular 2 components of the application. One component per page.
  + `\models` - the model layer of the application.
  + `\pipes` - a pipe for very simple currency formatting as the Angular 2 pipes are not working with NativeScript currently.
  + `\services` - two services, one to handle the communication to the Nestoria APIs and one to persist the recent searches.
  + `\views` - the NativeScript XML views used by the components.

##Further Reading

