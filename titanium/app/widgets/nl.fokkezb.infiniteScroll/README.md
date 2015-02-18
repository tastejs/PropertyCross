# Alloy *Infinite Scroll* widget [![Alloy](http://www-static.appcelerator.com/badges/alloy-git-badge-sq.png)](http://www.appcelerator.com/alloy/)
The *Infinite Scroll* widget implements the design pattern also known as *Dynamic Scroll* or *Endless Scroll* for TableViews and ListViews in the [Alloy](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Quick_Start) MVC framework for [Titanium](http://www.appcelerator.com/platform) by [Appcelerator](http://www.appcelerator.com). A Titanium Classic implementation can be found in the [KitchenSink](https://github.com/appcelerator/KitchenSink/blob/master/Resources/ui/handheld/ios/baseui/table_view_dynamic_scroll.js).

Also take a look at my [Pull to Refresh](https://github.com/FokkeZB/nl.fokkezb.pullToRefresh) widget.

## Overview
The widget automatically shows an *ActivityIndicator* in a *TableView* or *ListView*'s *FooterView* when the user reached the end of the table. An event is triggered so that the implementing controller can load more rows.

![screenshot](https://raw.github.com/FokkeZB/nl.fokkezb.infiniteScroll/master/docs/screenshot.png)

## Features
* Add the widget to your *TableView*  or *ListView* using just one line of code.
* Override all styling via your app's `app.tss`.
* Manually trigger the widget from your controller.

## Quick Start

### Get it [![gitTio](http://gitt.io/badge.png)](http://gitt.io/component/nl.fokkezb.infiniteScroll)
Download this repository and consult the [Alloy Documentation](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_XML_Markup-section-35621528_AlloyXMLMarkup-ImportingWidgets) on how to install it, or simply use the [gitTio CLI](http://gitt.io/cli):

`$ gittio install nl.fokkezb.infiniteScroll`

### Use it

* Add the widget to your *TableView*:

	```xml
	<TableView id="table">
	  <Widget id="is" src="nl.fokkezb.infiniteScroll" onEnd="myLoader" />
	</TableView>
	```
	
	or *ListView*:
	
	```xml
	<ListView id="list">
	  <Widget id="is" src="nl.fokkezb.infiniteScroll" onEnd="myLoader" />
	</ListView>
	```

* Since Alloy 1.3.0 you have to manually bind the parent from the controller:

	```
	$.is.init($.list);
	```

* In the callback set via `myLoader` you call either `e.success()`, `e.error()` or `e.done()` optionally passing a custom message.

	```javascript
	function myLoader(e) {

		var ln = myCollection.models.length;

		myCollection.fetch({

			// whatever your sync adapter needs to fetch the next page
			data: { offset: ln },

			// don't reset the collection, but add to it
			add: true,

			success: function (col) {
			
				// call done() when we received last page - else success()
				(col.models.length === ln) ? e.done() : e.success();

			},

			// call error() when fetch fails
			error: function(col) {
				// pass optional error message to display
				e.error(L('isError', 'Tap to try again...'));
			}
		});
	}
	```

	Please note that in the example above I use `col.models.length` instead of `col.length`. There is a flaw in Backbone that will cause unpredictable lengths when more then 1 sync is performed at the same time.
	
* To do the initial fetch call `$.is.load()`. If you add/remove items via other ways then the widget and you're using a *ListView* then call `$.is.mark()` after that!


## Styling

The widget can be fully styled without touching the widget source. For Alloy 1.4 and later use the classnames below in your theme's `app/themes/your-theme/widgets/nl.fokkezb.infiniteScroll/styles/widget.tss`. For Alloy 1.3 and earlier use the ID's in your app's `app.tss` to override the default style, which is set on the classes.

| class/ID | Description |
| --------- | ------- |
| `is` | The view to be added as *FooterView* |
| `isCenter` | Can be used to align the content, but mainly to support iOS7's `Ti.UI.Window.extendEdges` by setting `bottom` to the height of the TabGroup (49). |
| `isIndicator` | The *ActivityIndicator* showing during load |
| `isText` | The message shown when not loading. Set `visible` to `false` if you want to hide the text until the first load has happened. |

## Options
There are no required options to pass via TSS properties or XML attributes, apart from the `onEnd` attribute to bind your callback to the end-event. You can change the displayed messages by using the following options:

| Parameter | Type | Default |
| --------- | ---- | ----------- |
| msgTap | `string` | Tap to load more... |
| msgDone | `string` | No more to load... |
| msgError | `string` | Tap to try again... |

## Methods
You can also manually trigger the loading state of the widget. You could use this for the first load when your window opens.

| Function   | Parameters | Usage |
| ---------- | ---------- | ----- |
| setOptions | `object`   | Set any of the options
| load       |            | Manually trigger the `end` event and loading state
| state      | `state`, `string`    | Manually set the state. The first argument should be one of the exported `SUCCESS`, `DONE` and `ERROR` constants. The second optional argument is a custom message to display instead of the message belonging to the state.
| dettach    |            | Manually set the `DONE` state and remove the scroll listener
| init       | `Ti.UI.TableView`, `Ti.UI.ListView` | Manually init the widget if it's the child element of the *TableView* or *ListView*, or to work around [TC-3417](https://jira.appcelerator.org/browse/TC-3417) in Alloy 1.3.0 and later.
| mark       |            | If add/remove items from the *ListView* via other ways then the widget call `mark()` so the widget is triggered on the last item.

## Testing
There is a test app and instructions in the [test](https://github.com/FokkeZB/nl.fokkezb.infiniteScroll/tree/test) branch.

## Changelog
* 1.4.2:
  * Closes #30 so you can call `.mark()` to re-init the position tracking.
* 1.4.2:
  * Fixes #29 for Alloy 1.5.0 
* 1.4.1:
  * Fixes support for *ListViews* (marker loop after calling `e.done()`)
  * Anticipating future Alloy version where `__parentSymbol` works again
* 1.4.0:
  * Adds support for *ListViews*.
* 1.3.3:
  * Fixes #25 when using the widget with no XML.
* 1.3.2:
  * Workaround for regression in Alloy 1.3.0-cr
* 1.3.1:
  * Fixes scroll-load-state loop with fast syncs.
* 1.3:
  * Compatible with iOS7's new `Ti.UI.Window.extendEdges` via `#isCenter`.
  * Allows you to hide the text until first load by calling `show` after that
* 1.2:
  * Now compatible with Android (and other OS)
  * View will now always show since Android doesn't support removing it :(
* 1.1:
  * From now on declared in the XML view instead of the controller!
  * Splitted `init` into `setOptions` and `attach`
  * Renamed `remove` to `dettach`
  * Renamed `trigger` to `load` to not interfere with BackBone
* 1.0.1:
  * Fixed for Alloy 1.0GA
* 1.0: Initial version
itial version

## License

<pre>
Copyright 2013 Fokke Zandbergen

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
</pre>
