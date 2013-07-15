Changed in 2.0
======
* Upgraded Cordova to 2.6
* Switched to Grunt for building the application
* Switched to AMD architecture with RequireJS
* Added insert method to collections
* Added remove(index) signature to collections
* Added of Lavaca CLI tool
* Added responsefilter to models
* Enhanced collection of page transitions
* Added new way of specifying page transitions in Views
* Ability to listen for model attribute events in mapEvent method in Views

Changed in 1.0.5
======
* Upgraded Cordova to 2.2
* Enhanced build script to generate scripts.xml and styles.xml files based on specially annotated sections of the index.html
* Added computed attributes for models and collections ([more](https://github.com/mutualmobile/lavaca/wiki/3.1.-Models-and-Collections#wiki-computed-attributes))
* Added redraw() method to view that handels partial rendering based on a CSS selector or with custom redraw method
* Added initial hash route parsing to facilitate page refreshing
* Switched default templating engine to LinkedIn fork of Dust (NOTE: This change is not 100% backwards compatible. [Read more] (https://github.com/mutualmobile/Lavaca-modules/tree/master/x-dust#syntax-differences-from-default-lavaca-template-system))
* Overloaded collection's add() to accept an array of objects or models
* Added sort method to collections following _.sortBy pattern
* Added Dust helper to access variables from config files ([more](https://github.com/mutualmobile/lavaca/wiki/4.1.-Using-Templates-to-Generate-HTML#wiki-config-helper))
* Added entercomplete event that fires when a view is done animating

Changed in 1.0.4
======
* Upgraded Cordova to 2.1
* Fixed animation glitches in page transitions
* Updated Android ChildBrowser plugin to remove legacy ctx in favor of cordova.getContext()
* Removed preventDefault() from touchstart in tap events
* Added support for all iOS app icons and startup images
* Fixed an issue where $.fn.transition(props, duration, easing, callback) would not overload properly if transitions were not supported
* Fixed issue where a tap event would fire if the fake scroll was started/ended on a element with a tap handler
* Fixed issue in build.py where it was looking for mm:configs instead of Lavaca:configs
* Fixed toObject call on Models that have Models/Collections as an attribute
* Added better support for Android identity checks and added Mobile identity checks
* Fixed Model.validate() and added support for quickly checking if model is valid

Changed in 1.0.3
======
* Moved the "column" property from the model to the view in app.ui.BaseView
* Upgraded x-dust to 0.5.3
* Fixed an issue where views would fail to exit on Android 4.1
* Lavaca.env.Device no longer throws errors when Zepto is swapped out for jQuery
* Added support for target="_blank" on application's tap handler for `<a>` tags
* Fixed a timing issue with app.ui.BaseView's enter and exit animations
* Fixed an issue where the signature $.fn.touch(onstart, onmove, onend) would fail to bind handlers
* Fixed an issue where Lavaca.delay did not return a timeout ID
* Fixed an issue where event handlers were unbound from cached views when Zepto is swapped out for jQuery
* Documentation template no longer treats every method as static
* Android now parses all route variables consistently

Changed in 1.0.2
======
* Added enter/exit events for Lavaca.mvc.View
* Lavaca.mvc.Collection#fetch now works as expected with complex data containing arrays
* Lavaca.mvc.Collection now supports TModel being a Collection-type
* You can now delegate events to the view's model using the "model" selector. Those events will be automatically unbound when the view is disposed