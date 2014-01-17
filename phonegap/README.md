# PhoneGap Build

A number of the implementations of PropertyCross use PhoneGap to provide a web container into which to build an application using a web framework. PropertyCross uses [PhoneGap Build](http://build.phonegap.com) to build these projects, using the Grunt configuration specified here.

## Building

You'll need:

 + [Node](http://nodejs.org/)
 + [Grunt](http://gruntjs.com/getting-started) - I recommend you install `grunt` globally as well as `grunt-cli`, so that you don't have to keep doing npm install in each of the implementaion directories.
 + Implementation-specific dependencies (e.g. maven for mgwt; sencha-cmd for senchatouch2)

Once you have those installed, you'll need to do `npm install` in the `phonegap/common` and `phonegap/common-with-winphone` directories. You can then just run `grunt` to do the build.

If you're not a member of the TasteJS team and do not have the password to use our PhoneGap Build accounts, you can create your own account, and use grunt to generate the zip file for uploading. Typically the command for this would be `grunt clean copy compress` or `grunt clean exec copy compress` depending on whether the implementation uses a supplementary tool to generate the web resources.
