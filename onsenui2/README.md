# Onsen UI 2 implementation with Angular 1
Visit [Onsen UI page](https://onsen.io/)

##Introduction

Onsen UI provides UI framework and tools for creating fast and beautiful HTML5 hybrid mobile apps based on PhoneGap/Cordova. Having common core with no framework dependencies, app development with Onsen UI is easy with any of the ever-changing JavaScript frameworks.

##Building the Application
First follow [Apache Cordova](https://cordova.apache.org/#getstarted) or [PhoneGap](http://docs.phonegap.com/getting-started/1-install-phonegap/cli/) install instrucctions.

Then install the needed NPM packages:

```
$ npm install
```

And setup project:

```
$ npm run setup
```

###Add your chosen platform

```
$ phonegap platform add android
$ phonegap platform add ios
```

###Develop

```
$ phonegap serve
```

###Build

```
$ phonegap build android
$ phonegap build ios
```

##Application Structure
+ `package.json`
+ `config.xml` - Cordova/PhoneGap configuration file
+ `\www`
  + `index.html` - Entry HTML for app.
  + `\res` - icons and splashscreens used by the app.
  + `\services` - Services to handle the communication to the Nestoria APIs and persist recent searches and favourites.
  + `\pages` - Includes a folder for each app page (view and logic).
  + `\assets` - Vendor and Custom JavaScript and styles.

