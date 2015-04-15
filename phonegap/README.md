# PhoneGap Build

A number of the implementations of PropertyCross use PhoneGap to provide a web container into which to build an application using a web framework. PropertyCross uses [PhoneGap Build](http://build.phonegap.com) to build these projects, using the Grunt configuration specified here.

PhoneGap uses a configuration file, `config.xml`, which describes the application and services that it uses. Rather than duplicate this information for each PhoneGap-wrapper PropertyCross implementation, a templated configuration file is used and included via the build process.

## Building

You'll need:

 + [Node](http://nodejs.org/)
 + [Grunt](http://gruntjs.com/getting-started) - I recommend you install `grunt` globally as well as `grunt-cli`, so that you don't have to keep doing npm install in each of the implementaion directories.
 + Implementation-specific dependencies (e.g. maven for mgwt; sencha-cmd for senchatouch2)
 + A [PhoneGap Build](https://build.phonegap.com) account

Once you have those installed, you'll need to run `npm install` in the `phonegap/common` and `phonegap/common-with-winphone` directories. 

### Building a single application

 + Navigate to the folder for the application, e.g. `/ionic`
 + Execute `grunt clean copy compress` - this will create a zip file containing the app code together with the configuration file.
 + If the implementation has its own build steps (e.g. GWT, Sencha), you will need to execute `grunt clean exec copy compress`. 
 + Upload the zip file to your PhoneGap build account, following the required steps for signing. Note that the application uses the identified `com.propertycross.*`, so your iOS provisioning profile must support this ID.

### Automated PhoneGap Build upload

You can also use grunt to upload the zipped app to your PhoneGap Build account. To do this you must supply your email and password:

    grunt --pgb.email=your@email.com --pgb.password=******

Before you use this, you must update the `appId` within the `package.json` of the respective PropertyCross implementation to match the Id for this app within your own PhoenGap Build account, i.e. you must build manually first before your can use this build step.

## Workarounds

Unfortunately, PhoneGap Build does not support the PhoneGap `merges` structure. We have implemented a crude workaround that switches the `index.html` that is used in the app, but were you producing a production app, we would recommend using the local build if you need to customise the different platforms.
