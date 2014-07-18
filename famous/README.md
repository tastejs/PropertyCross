#Famo.us PropertyCross

Visit the [famo.us page](http://propertycross.com/famous/) on the PropertyCross website for screenshots and code sharing metrics.

##Overview

Famo.us is a free and open source JavaScript platform for building mobile apps and desktop experiences. What makes Famo.us unique is its JavaScript rendering engine and 3D physics engine that gives developers the power and tools to build native quality apps and animations using pure JavaScript. Famo.us runs on iOS, Android, Kindle and Firefox devices and the [Famo.us University](https://famo.us/university) is a free live coding classroom that teaches all levels of developers how to utilize Famo.us to build beautiful experiences on every screen.

The PropertyCross implementation depends on Famo.us to handle the rendering, animations and event signalling.  A custom MVVM architecture has been used to reduce coupling in the code and the theming does not vary across platforms.  The PhoneGap Build service is used to package up the application and has been tested on iOS 7, Android 4.4 and Window Phone 8.

###Interesting Observations with Famo.us

#### Mobile pages with Famo.us
Famo.us does not define a mobile page, or a mechanism to navigating between them.  This meant the implementation took responsibility for tracking the routing and page transitions.

Libraries like 'crossroads.js' may be a good provide a good fit for handling the routing of pages and state, however these were not considered when this app was initially implemented.

####MVVM with Famo.us
In order bring MVVM into the implementation, the event system in Famo.us was used alongside the Prototypical Inheritance in Javascript.  The architecture of Famo.us enables you to create your custom views and receive and send events, it seemed acceptable to allow views to have direct access to view models and to listen to respond to events emitted view models.

With the event system in Famo.us providing some useful features (such as event piping and event mapping), a Model - View - Presenter or Model - View - Adaptor architecture might provide a better mapping.  For an implementation as complex as PropertyCross, this did not seem to be worth the effort, but for more complex applications this architecture may be a more suitable / scalable solution.

####Native LAF with Famo.us
Famo.us does not provide a set of libraries or tools for native theming.

With all the style properties of objects been defined in Javascript, it would be possible to add a library to detect the platform and use code to change the styling.  Whilst this may not be too challenging in PropertyCross, this becomes much more complex when you want to mimic native controls - such as toggle buttons or activity animations.

####Layout with Famo.us
There were a few layout issues which were needed that we not natively supported in Famo.us, which have been implemented in PropertyCross:

#####Margin Layout
When the application needs to be response to screen size you need to be able to add margins to items, rather than calculated the screen width one and setting a static size.

The `MarginLayout` allows a margin to be added to a Surface or View.  It is aware of the size of its parent, so can make the calculations to size its child nodes as needed.

#####Ratio Layout
Some UI designs / guidelines require nodes to be sized at a particular aspect ratio.

The `RatioLayout` resizes its child nodes so that they match a particular ratio, whilst taking as much of the parent area as possible.

#####Visibility Layout
The `VisibilityLayout` as a modifier that allows nodes to be shown and hidden.  Unlike the existing modifiers for opacity, a hidden node does not exist on the page therefore and does not receive mouse events.

##Application Structure

 + `app/`
   + `assets/` - resource files (i.e. images) used by cordova / phonegap
   + `lib/` - famo.us / third-party libraries
   + `src/` - application javascript source
   + `styles/` - application css files
   + `index.html` - root html page for application
 + `grunt/` - contains build settings for Famous and PhoneGap Build service

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

##Integration with PhoneGap Build service

Famo.us does not provide integration with the PhoneGap Build service out-the-box.  The following files were added / modified to make this integration possible:
+ `grunt/`
  + `grunt/compress` - creates a zip from the app directory and a generated cordova config xml file
  + `grunt/copy` - adds `configXML` settings to generate and store cordova config xml file generated from a template
  + `grunt/phonegap-build` - uploads the zip to the PhoneGap Build service and downloads the built applications
