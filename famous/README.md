#Famo.us PropertyCross

Visit the [famo.us page](http://propertycross.com/famous/) on the PropertyCross website for screenshots and code sharing metrics.

##Introduction

Famo.us is a free and open source JavaScript platform for building mobile apps and desktop experiences. What makes Famo.us unique is its JavaScript rendering engine and 3D physics engine that gives developers the power and tools to build native quality apps and animations using pure JavaScript. Famo.us runs on iOS, Android, Kindle and Firefox devices and integrates with [Angular](http://famo.us/integrations/angular/), Backbone, Meteor and Facebook React. [Famo.us University](https://famo.us/university) is a free live coding classroom that teaches all levels of developers how to utilize Famo.us to build beautiful experiences on every screen.

Find out more at [Famo.us website](http://famo.us).

##Application Structure

 + `app/`
   + `content/` - resource files (i.e. images) used by application
   + `lib/` - famo.us / third-party libraries
   + `src/` - application javascript source
   + `styles/` - application css files
   + `index.html` - root html page for application

##Building The Application

First make sure you have node.js installed... without that nothing works!  You can either install it with your favourite package manager or with [the installer](http://nodejs.org/download) found on [nodejs.org](http://nodejs.org).

This project relies on grunt-cli, and bower to do all the heavy lifting for you

```
npm install -g grunt-cli bower
```

To get started, you run

```
npm install && bower install
```

That's it!!!

##Running the Development Server

Simply run ```grunt serve``` and you will start a local development server and open Chrome.  Watch tasks will be running, and your browser will be automatically refreshed whenever a file changes.

You can run serve with ```--port=9001``` to manually pick the port that the server will run on

*This option is currently borked...*
You can also change the port livereload is running on with the option ```--livereload=8675309```
*... if you think you can fix it check out the [issue on github](https://github.com/Famous/generator-famous/issues/22)*

If you would like to have your server be accessible to other devices on your local machine use the option ```--hostname=0.0.0.0```

##Production

If you would like to compile your project for distribution simply run the command ```grunt``` to build ```dist/``` which will be a deployment ready version of your app.  Preprocessing will be applied to html, all js will be concatenated and minified.  All js / css assets will also have their name prepended with a hash for cache busting.

