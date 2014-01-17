/*
   Copyright (c) 2012-13, Emy Project Members.
   See LICENSE.txt for licensing terms.
   Version 1.0
 */

(function() {

	var slideSpeed = 10; // milliseconds between each JS sliding step - only if CSS transition is not supported
	var slideStep = 5; // percent of each JS sliding step - only if CSS transition is not supported
	var ajaxTimeoutVal = 30000;
	var prefix = null;

	var originalView = null;
	var currentView = null;
	var currentDialog = null;
	var currentWidth = 0;
	var currentHeight = 0;
	var currentHash = location.hash;
	var hashPrefix = "#";
	var viewHistory = []; // Navigation stack (poorly named, different from browser history)
	var newViewCount = 0;
	var checkTimer;
	var screenHeight = 0;

	// *************************************************************************************************

	/*
	events:
	emy fires a number of custom events on your panel and dialog elements. Handling
	these events is the recommended way to do any just-in-time transformations or
	loading (besides the ajax pre-loading built into emy).
	*/

	window.emy = {
		/*
	used in emy.log()
	initialized at: onload.
	This is set to `true`, console.log is enabled
	*/
	logging: false,

	/*
	emy.busy
	initialized at: onload.
	This is set to `true` if a slide animation is in progress.
	*/
	busy: false,

	/*
	emy.transitionMode
	initialized at: onload.
	Determines which transition mode to use between two screens.
	Value can be 'css', 'js' or 'none' - if 'css', a test is done onLoad to determine is 'css' transition is supported. If not, value is changed to 'js'.
	*/
	transitionMode: 'css',

		/*
	emy.ajaxErrHandler
	initialized at: onload.
	If defined, this user-set function will be called when an AJAX call returns
	with an HTTP status other than `200` (currently all HTTP statuses other than
	`200`, even including 200-level statuses like `201 Created`, are seen as
	errors.  A status of `0` is treated as success for file:// URLs).
	*/
	ajaxErrHandler: null,

	/*
	emy.httpHeaders
	initialized at: onload.
	An object defining headers to be sent with Ajax requests.
	*/
	httpHeaders: {
		"X-Requested-With": "XMLHttpRequest"
	},

	/*
	emy.prefixedProperty
	initialized at: onload.
	Vendor prefixed CSS3 events methods for transform, transition and transitionEnd
	NOTE: This might be removed when more than 90% of daily-used browsers support non-prefixed events
	*/
	prefixedProperty: [],

		/*
	emy.prefixedProperty
	initialized at: onload.
	An array where all plugins should be
	*/
	plugin: [],

	/*
	emy.ready
	initialized at: onload.
	Determines if Emy has been initialized yet (if the init() function has been already loaded)
	*/
	ready : false,

	/*
	emy.init
	Loads private function init(), automatically loaded by onload event, but you can manually load it
	This change is really helpful when using Emy inside for a PhoneGap/Cordova app with deviceready event for ex
	*/
	 init : function() {
		init();
	 },
	/*
	emy.showView(view[, backwards=false])
	`showView()` should probably be an internal function, outside callers should
	call `showViewById()` instead. `showView()` does NOT set the busy flag because
	it is already set by the public-facing functions.

	`view` is the html element to show. If `backwards` is set to `true`, it will
	display a right-to-left animation instead of the default left-to-right.

	If the currently-displayed view is passed, emy will do nothing. `showView()`
	is used for both panel-type views and dialog-type views (dialogs float on top
	of the panels, have a cancel button and do not participate in sliding
	animations). Panel-type views receive blur/focus events and load/unload events,
	but dialog-type views only receive blur/focus events.
	*/
		showView: function(view, backwards) {
			if (view) {
				if (view == currentView) {
					emy.busy = false; //  Don't do anything, just clear the busy flag and exit
					return;
				}

				if (currentDialog) {
					currentDialog.removeAttribute("selected");
					sendEvent("blur", currentDialog); // EVENT: BLUR
					currentDialog = null;
				}

				/*
			events:
			Dialogs receive a `focus` event when they are shown and a `blur` event
			when hidden. Currently they don't receive any `load` or `unload` events.
			*/
				if (emy.hasClass(view, "dialog")) {
					sendEvent("focus", view); // EVENT: FOCUS
					showDialog(view);
				}
				/*
			events:
			Panels receive `focus` and `blur` events and also receive a `load` event
			and (only when going backwards away from a panel) an `unload` event.
			*/
				else {
					//			  emy.$('header.toolbar').style.display='';
					sendEvent("load", view); // EVENT: LOAD
					var fromView = currentView;
					sendEvent("blur", currentView); // EVENT: BLUR
					currentView = view;
					sendEvent("focus", view); // EVENT: FOCUS

					if (fromView) setTimeout(slideViews, 0, fromView, view, backwards);
					else updateView(view, fromView);

				}
			}
		},


		gotoView: function(view, replace) {
			var node, nodeId;

			if (view instanceof HTMLElement) {
				node = view;
				nodeId = node.id;
			} else {
				nodeId = view;
				node = emy.$(hashPrefix + nodeId);
			}

			if (!node) emy.log("gotoView: node is null");

			if (!emy.busy) {
				emy.busy = true;
				var index = viewHistory.indexOf(nodeId);
				var backwards = index != -1;
				if (backwards) {
					// we're going back, remove history from index on
					// remember - viewId will be added again in updateView
					viewHistory.splice(index);
				} else if (replace) viewHistory.pop();

				emy.showView(node, backwards);
				return false;
			} else {
				return true;
			}
		},


		/*
	emy.showViewById(viewId)
	Looks up the view element by the id and checks the internal history to
	determine if the view is on the stack -- if so, it will call `showView()` with
	`backwards` set to `true`, reversing the direction of the animation.
	*/
		showViewById: function(viewId) {
			emy.gotoView(viewId, false);
		},

		/*
	emy.goBack()
	Navigates to the previous view in the history stack.
	*/
		goBack: function(viewId) {
			if (viewId) {
				var a = viewHistory.length - (viewHistory.indexOf(viewId) + 1);
				viewHistory = viewHistory.slice(0, (viewHistory.length - a));
				window.history.go(-a);
			} else {
				window.history.go(-1);
				viewHistory.pop();
			}
			emy.log(viewHistory);
		},


		/*
	method: emy.replaceView(viewId)
	Loads a new view at the same level in the history stack.
	Currently it will do a slide-in animation, but replaces
	the current view in the navStack.
	It should probably use a different animation (slide-up/slide-down).
	Since for now it just doesn't work, we removed it

	replaceView: function(view)
	{
	    gotoView(view, true);
	},
	*/

		/*
	method: emy.showViewByHref(href, args, method, replace, cb)
	Outside callers should use this version to do an ajax load programmatically
	from your webapp.

	`href` is a URL string, `method` is the HTTP method (defaults to `GET`),
	`args` is an Object of key-value pairs that are used to generate the querystring,
	`replace` is an existing element that either is the panel or is a child of the
	panel that the incoming HTML will replace (if not supplied, emy will append
	the incoming HTML to the `body`), and `cb` is a user-supplied callback function.
	*/
		showViewByHref: function(url, args, method, replace, cb) {
			// I don't think we need onerror, because readyState will still go to 4 in that case

			function spbhCB(xhr) {
				if (xhr.readyState == 4) {
					if ((xhr.status == 200 || xhr.status == 0) && !xhr.aborted) {
						// Add 'if (xhr.responseText)' to make sure we have something???
						// Can't use createDocumentFragment() here because firstChild is null and childNodes is empty
						var frag = document.createElement("div");
						frag.innerHTML = xhr.responseText;
						// EVENT beforeInsert->body
						/*
					events:
					When new views are inserted into the DOM after an AJAX load, the `body`
					element receives a `beforeinsert` event with `{ fragment: frag }` parameters
					and afterwards receives an `afterinsert` event with `{insertedNode: docNode}` parameters.
					*/
						sendEvent("beforeinsert", document.body, {
							fragment: frag
						})
						if (replace) {
							replaceElementWithFrag(replace, frag);
							emy.busy = false;
						} else emy.insertViews(frag);
					} else {
						emy.busy = false;
						if (emy.ajaxErrHandler) {
							emy.ajaxErrHandler("Error contacting server, please try again later");
						}
					}
					if (cb) {
						setTimeout(cb, 1000, true);
					}
				}

			};
			if (!emy.busy) {
				emy.busy = true;
				emy.ajax(url, args, method, spbhCB);
			} else {
				cb(); // We didn't get the "lock", we may need to unselect something
			}
		},

		/*
	method: emy.ajax(url, args, method, cb)
	Handles ajax requests and also fires a `setTimeout()` call
	to abort the request if it takes longer than 30 seconds. See `showViewByHref()`
	above for a description of the various arguments (`url` is the same as `href`).
	*/
		ajax: function(url, args, method, cb) {
			var xhr = new XMLHttpRequest();
			method = method ? method.toUpperCase() : "GET";
			if (args && method == "GET") {
				url = url + "?" + emy.param(args);
			}
			xhr.open(method, url, true);
			if (cb) {
				xhr.onreadystatechange = function() {
					cb(xhr);
				};
			}
			var data = null;
			if (args && method != "GET") {
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				data = emy.param(args);
			}
			for (var header in emy.httpHeaders) {
				xhr.setRequestHeader(header, emy.httpHeaders[header]);
			}
			xhr.send(data);
			xhr.requestTimer = setTimeout(ajaxTimeout, ajaxTimeoutVal);
			return xhr;

			function ajaxTimeout() {
				try {
					xhr.abort();
					xhr.aborted = true;
				} catch (err) {
					emy.log(err);
				}
			}
		},

		/*
	method: emy.param(o)
	Stripped-down, simplified object-only version of a jQuery function that
	converts an object of keys/values into a URL-encoded querystring.
	*/
		param: function(o) {
			var s = [];
			// Serialize the key/values
			for (var key in o) {
				var value = o[key];
				if (typeof(value) == "object" && typeof(value.length) == "number") {
					for (var i = 0; i < value.length; i++) {
						s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value[i]);
					}
				} else s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
			}
			// Return the resulting serialization
			return s.join("&")
				.replace(/%20/g, "+");
		},

		/*
	method: emy.insertViews(frag)
	If an AJAX call (`showViewByHref()`) is made without supplying a `replace`
	element, `insertViews()` is called to insert the newly-created element
	fragment into the view DOM. Each child-node of the HTML fragment is a panel
	and if any of them are already in the DOM, they will be replaced by the
	incoming elements.
	*/
		insertViews: function(frag, go) {
			var nodes = frag.childNodes, targetView;
			go = (go==false)?false:true;
			for (var i = 0; i < nodes.length; ++i) {
				var child = nodes[i];
				if (child.nodeType == 1) {
					if (!child.id) child.id = "__" + (++newViewCount) + "__";

					var clone = emy.$('#' + child.id);
					var docNode;
					if (clone) {
						clone.parentNode.replaceChild(child, clone);
						docNode = emy.$(child.id);
					} else
						docNode = document.body.appendChild(child);

					sendEvent("afterinsert", document.body, {
						insertedNode: docNode
					});
					fitHeight();

					// First child becomes selected view/view by default unless
					// selected="true" is set
					// BUG: selected="true" results in a visually incorrect transition
					if (child.getAttribute("selected") == "true" || !targetView) targetView = child;
					--i;
				}
			}
			sendEvent("afterinsertend", document.body, {
				fragment: frag
			})

			if (targetView && go) setTimeout(function() {
				emy.showView(targetView)
			}, 1);

		},

		/*
	method: emy.getSelectedView()
	Returns the panel element that is currently being viewed. Each panel must be a
	direct child of the `body` element. A panel is set as the selected panel by
	setting the `selected` attribute to `true`.
	*/

		getSelectedView: function() {
			for (var child = document.body.firstChild; child; child = child.nextSibling) {
				if (child.nodeType == 1 && child.getAttribute("selected") == "true") return child;
			}
		},

		/*
	emy.getAllViews()
	Returns all views, aka direct body childnodes with both `id` and `data-title` attributes
	*/
		getAllViews: function() {
			var nodes = document.body.children,
				views = [];
			if (nodes) {
				for (var i = 0, inb = nodes.length; i < inb; i++) {
					if (nodes[i].id && nodes[i].getAttribute('data-title')) {
						views.push(nodes[i]);
					}
				}
				return views;
			} else return false;
		},

		/*
	emy.isNativeUrl(href)
	Determines whether the supplied URL string launches a native iPhone app (maps, YouTube, phone, email, etc). If so, emy does nothing (doesn't attempt to load a view or slide to it) and allows the phone to handle it the click natively.
	*/
		isNativeUrl: function(url) {
			var urlPatterns = [
			new RegExp("^http:\/\/maps.google.com\/maps\?"),
			new RegExp("^mailto:"),
			new RegExp("^tel:"),
			new RegExp("^http:\/\/www.youtube.com\/watch\\?v="),
			new RegExp("^http:\/\/www.youtube.com\/v\/"),
			new RegExp("^javascript:"),
			new RegExp("^sms:"),
			new RegExp("^callto:")];
			var out = false;
			for (var i = 0; i < urlPatterns.length; i++) {
				if (url.match(urlPatterns[i])) out = true;
			}
			return out;
		},

		/*
	emy.hasClass(el, name)
	Returns true/false if the given element `el` has the class `name`.
	*/
		hasClass: function(el, name) {
			return ((el.className)
				.indexOf(name) > -1) ? true : false;
		},

		/*
	emy.addClass(el, name)
	Add the given class `name` to element `el`
	*/
		addClass: function(el, name) {
			if (!emy.hasClass(el, name)) el.className += " " + name;
		},

		/*
	emy.changeClass(el, name)
	change the given class `name` to `newname` to element `el`
	*/
		changeClass: function(el, name, newname) {
			if (emy.hasClass(el, name)) el.className = el.className.replace(new RegExp('(\\s|^)' + name + '(\\s|$)'), newname);
		},

		/*
	Basic selector : if you need a complete Jquery-style, you might consider Zepto.js
	Use emy.$('#myElement') to select an element with id attribute equals to myElement
	Use emy.$('.myClass') to select all elements having myClass in their class value
	Use emy.$('a') to select all a elements (links)
	Use emy.$('a.myClass') to select all a elements having myClass in their class value (links)
	*/
		$: function(a) {
			if(document.querySelectorAll) {
				var res = document.querySelectorAll(a);
				return (res.length==0)?null:(res.length==1 & '#'+res[0].id==a)?res[0]:res;
			} else {
				// this should soon be removed, since all modern browsers supports querySelectorAll now
				if (a.substr(0, 1) == '#') return (document.getElementById(a.substr(1))) ? document.getElementById(a.substr(1)) : null;
				else if (a.substr(0, 1) == '.') return (document.getElementsByClassName(a.substr(1))) ? document.getElementsByClassName(a.substr(1)) : null;
				else if (a.indexOf('.') > -1) {
					var c = document.getElementsByTagName(a.split('.')[0]),
						d = a.split('.')[1];
					for (var i = 0, inb = c.length; i < inb; i++) {
						if (c[i].className.indexOf(d) > -1) {
							return c[i];
							exit;
						}
					}
				} else if (a) return (document.getElementsByTagName(a)) ? document.getElementsByTagName(a) : null;
			}
		},

		/*
		Performs a console.log if browser supports it
		Keep logging to false by default, console.log can create huge performance issues, specially in Cordova
		*/
		log: function() {
			if ((window.console != undefined) && emy.logging==true) console.log.apply(console, arguments);
		}
	};

	// *************************************************************************************************

/*
load: On Load event
*/
	addEventListener("load", init, false);

/*
init: On Load
On load, emy will determine which view to display primarily based on
the anchor part of the URL (everything after `#_`) and secondarily based on the
top-level (child of the `body`) element with the `selected` attribute set to
`true`. If these both exist, emy.showView() will be called twice, but the
anchor-based load will win because it is done second.
*/

	function init()
	{
		if(!emy.ready)
		{
			emy.ready=true;
			var a = document.createElement('div').style;
			prefix = (a.WebkitTransform == '') ? 'webkit' : (a.MozTransform == '') ? 'moz' : (a.msTransform == '') ? 'ms' : (a.transform == '') ? 'none' : null;
			if (emy.transitionMode == 'css') emy.transitionMode = (prefix) ? 'css' : 'js';
			if (prefix == 'webkit') {
				emy.prefixedProperty['transform'] = 'webkitTransform';
				emy.prefixedProperty['transformDuration'] = 'webkitTransformDuration';
				emy.prefixedProperty['transitionEnd'] = 'webkitTransitionEnd';
				emy.prefixedProperty['animationStart'] = 'webkitAnimationStart';
				emy.prefixedProperty['animationDuration'] = 'webkitAnimationDuration';
				emy.prefixedProperty['animationEnd'] = 'webkitAnimationEnd';
			} else if (prefix == 'moz') {
				emy.prefixedProperty['transform'] = 'MozTransform';
				emy.prefixedProperty['transformDuration'] = 'MozTransformDuration';
				emy.prefixedProperty['transitionEnd'] = 'transitionend';
				emy.prefixedProperty['animationStart'] = 'animationstart';
				emy.prefixedProperty['animationDuration'] = 'animationduration';
				emy.prefixedProperty['animationEnd'] = 'animationend';
			} else if (prefix == 'ms') {
				emy.prefixedProperty['transform'] = 'msTransform';
				emy.prefixedProperty['transformDuration'] = 'msTransformDuration';
				emy.prefixedProperty['transitionEnd'] = 'transitionend';
				emy.prefixedProperty['animationStart'] = 'MSAnimationStart';
				emy.prefixedProperty['animationDuration'] = 'MSAnimationDuration';
				emy.prefixedProperty['animationEnd'] = 'MSAnimationEnd';
			} else if (prefix == 'none') {
				emy.prefixedProperty['transform'] = 'msTransform';
				emy.prefixedProperty['transformDuration'] = 'msTransformDuration';
				emy.prefixedProperty['transitionEnd'] = 'transitionend';
				emy.prefixedProperty['animationStart'] = 'MSAnimationStart';
				emy.prefixedProperty['animationDuration'] = 'MSAnimationDuration';
				emy.prefixedProperty['animationEnd'] = 'MSAnimationEnd';
			}

			var view = emy.getSelectedView();
			var locView = getViewFromLocation();

			if (view) {
				originalView = view;
				emy.showView(view);
			}

			if (locView && (locView != view)) emy.showView(locView);

			//set resize handler onorientationchange if available, otherwise use onresize
			if (typeof window.onorientationchange == "object") window.onorientationchange = resizeHandler;
			else window.onresize = resizeHandler;

			// use modern onhashchange listener for navigation, fallback to listener if not supported
			if ("onhashchange" in window) window.onhashchange = checkLocation;
			else checkTimer = setInterval(checkLocation, 300);

			setTimeout(function() {
				preloadImages();
				checkLocation();
				fitHeight()
			}, 1);
		}
	}

	/*
	click: Link Click Handling
	emy captures all clicks on `a` elements and goes through a series of checks to
	determine what to do:

	1. If the link has a `href="#..."`, emy will navigate to the panel ID specified
	   after the # (no underscore).
	2. If the link's ID is `backButton`, emy will navigate to the previous screen
	   (see `emy.goBack()`).
	3. If the link has a `type="submit"`, emy will find the parent `form` element,
	   gather up all the input values and submit the form via AJAX (see
	   `emy.showViewByHref()`).
	4. If the link has a `type="cancel"`, emy will cancel the parent `form` element
	   dialog.
	5. If the link has a `target="_replace"`, emy will do an AJAX call based on the
	   href of the link and replace the panel that the link is in with the contents
	   of the AJAX response.
	6. If the link is a native URL (see `emy.isNativeURL()`), emy will do nothing.
	7. If the link has a `target="_webapp"`, emy will perform a normal link,
	   navigating completely away from the emy app and pointing the browser to the
	   linked-to webapp instead.
	8. If there is no `target` attribute, emy will perform a normal (non-replace)
	   AJAX slide (see `emy.showViewByHref()`).
	*/
	addEventListener("click", function(event) { /* an iOS6 bug stops the timer when a new tab fires an alert - this fixes the issue */
		if (!emy.busy && !("onhashchange" in window)) checkTimer = setInterval(checkLocation, 300);

		var link = findParent(event.target, "a");
		if (link) {
			function unselect() {
				link.removeAttribute("selected");
			}
			if (link.href && link.hash && link.hash != "#" && !link.target) {
				followAnchor(link);
			} else if (link == emy.$("#backButton")) {
				link.setAttribute("selected", "true");
				setTimeout(function() {
					unselect();
				}, 300);
				emy.goBack();
			} else if (link.target == "_replace") {
				followAjax(link, link);
			} else if (emy.isNativeUrl(link.href)) {
				return;
			} else if (link.target == "_webapp") {
				location.href = link.href;
			} else if (!link.target && link.getAttribute('href')) {
				followAjax(link, null);
			} else if (link.getAttribute('href') == '') {

			} else {
				return;
			}
			event.preventDefault();
		}


		var div = findParent(event.target, "div");
		if (div && emy.hasClass(div, "toggle")) {
			var toggleVal = div.getAttribute("toggled");
			(toggleVal != null) ? div.removeAttribute('toggled') : div.setAttribute("toggled", "");
			// if an input element is inside the toggle, its value will be set to true/false.
			var nodes = div.childNodes;
			for (var i = 0; i < nodes.length; ++i) {
				if (nodes[i].nodeType == 1) {
					if (nodes[i].getAttribute('type') != null) {
						nodes[i].value = (toggleVal == null);
					}
				}
			}
			event.preventDefault();
		}

		var button = findParent(event.srcElement, "button");
		if (button && button.getAttribute("type") == "cancel") {
			var view = findParent(event.srcElement, "section");
			if(emy.hasClass(view,'dialog'))
				cancelDialog(view);
		}
	}, true);

	/*
submit: Form submit handling
All forms without target="_self" will use emy's Ajax from submission.
*/
	addEventListener("submit", function(event) {
		var form = event.target;
		if (form.target != "_self") {
			event.preventDefault();
			submitForm(form);
		}
	}, true);

	function followAnchor(link) {
		link.setAttribute("selected", "true");
		var busy = emy.gotoView(link.hash.substr(1), false);
		// clear selected immmediately if busy, else wait for transition to finish
		setTimeout(function() {
			link.removeAttribute("selected");
		}, busy ? 0 : 500);
	}

	function followAjax(link, replaceLink) {
		link.setAttribute("selected", "progress");
		emy.showViewByHref(link.href, null, "GET", replaceLink, function() {
			link.removeAttribute("selected");
		});
	}

	function sendEvent(type, node, props) {
		if (node) {
			var event = document.createEvent("UIEvent");
			event.initEvent(type, false, false); // no bubble, no cancel
			if (props) {
				for (i in props) {
					event[i] = props[i];
				}
			}
			node.dispatchEvent(event);
		}
		emy.log('event sent: ' + type);
	}

	function getViewFromLocation() {
		var view = location.hash.substr(hashPrefix.length);
		return (view) ? emy.$('#' + view) : null;
	}

	function resizeHandler() {
		fitHeight();
	}

	function checkLocation() {
		emy.log('checkLocation');
		emy.log(viewHistory);
		if (location.hash != currentHash) {
			var viewId = location.hash.substr(hashPrefix.length);
			if ((viewId == "") && originalView) // Workaround for WebKit Bug #63777
			viewId = originalView.id;
			emy.showViewById(viewId);
		}
	}

	function showDialog(view) {
		scrollTo(0, 1);
		currentDialog = view;
		view.setAttribute("selected", "true");
		if (emy.transitionMode == 'css') setTimeout(function() {
			emy.addClass(view, 'show');
		}, 1); // adding the classname one second later otherwise CSS3 transitions does not apply
		else emy.addClass(view, 'show');
		showForm(view);
		view.onclick = function(e) {
			if (e.srcElement) {
				if (emy.hasClass(e.srcElement, 'dialog')) cancelDialog(e.srcElement);
			}
		};
	}

	function cancelDialog(form) {
		if (emy.transitionMode == 'css') {
			setTimeout(function() {
				emy.changeClass(form, 'show', '');
			}, 1);
			form.addEventListener(emy.prefixedProperty['transitionEnd'], hideForm, false);
		} else {
			emy.changeClass(form, 'show', '');
			hideForm(form);
		}
	}

	function showForm(form) { /* Noop click-handler on the view works around problem where our main click handler doesn't get called in Mobile Safari */
		form.addEventListener("click", function(event) {}, true);
		emy.busy = false;
	}

	function hideForm(form) {
		emy.$('header.toolbar')
			.style.display = '';
		if (undefined == form.srcElement) form.removeAttribute("selected");
		else {
			form.srcElement.removeAttribute("selected");
			form.srcElement.removeEventListener(emy.prefixedProperty['transitionEnd'], hideForm, false);
		}
	}

	function updateView(view, fromView) {
		if (!view.id) view.id = "__" + (++newViewCount) + "__";

		currentHash = hashPrefix + '' + view.id;
		if (!fromView) { // If fromView is null, this is the initial load and we want to replace a hash of "" with "#_home" or whatever the initial view id is.
			//		location.replace(location.protocol + "//" + location.hostname + location.port + location.pathname + newHash + location.search);
			location.replace(currentHash);
		} else { // Otherwise, we want to generate a new history entry
			//		location.hash = currentHash;
			location.assign(currentHash);
		}

		viewHistory.push(view.id);

		var viewTitle = emy.$('#viewTitle');
		if (view.getAttribute('data-title')) {
			viewTitle.innerHTML = view.getAttribute('data-title');
		}

		if (view.localName.toLowerCase() == "form") showForm(view);

		var backButton = emy.$("#backButton");
		if (backButton) {
			var prevView = emy.$('#' + viewHistory[viewHistory.length - 2]);
			if (prevView && !view.getAttribute("data-hidebackbutton")) {
				backButton.style.display = "block";
				backButton.innerHTML = (prevView.getAttribute('data-title')) ? prevView.getAttribute('data-title') : "Back";
				//			var bbClass = prevView.getAttribute("bbclass");
				//			backButton.className = (bbClass) ? 'button ' + bbClass : 'button';
			} else backButton.style.display = "none";
		}
		emy.busy = false;
	}


	function canDoSlideAnim() {
		return (emy.transitionMode != 'none') && (emy.prefixedProperty != null);
	}
	/*
events:
Both panels involved in a slide animation receive `beforetransition` and
`aftertransition` events. The panel being navigated from receives event
parameters `{ out :true }`, the panel being navigated to receives `{ out: false }`.
*/
	function slideViews(fromView, toView, backwards) {
		scrollTo(0, 1);
		clearInterval(checkTimer);

		sendEvent("beforetransition", fromView, {
			out: true
		});
		sendEvent("beforetransition", toView, {
			out: false
		});

		if (emy.transitionMode == 'css') slideCSS(fromView, toView, backwards, slideDone);
		else if (emy.transitionMode == 'js') slideJS(fromView, toView, backwards, slideDone);
		else noSlide(fromView, toView, slideDone);

		function slideDone() {
			if (!emy.hasClass(toView, "dialog")) {
				fromView.removeAttribute("selected");
				fromView.removeAttribute('emy-transition');
				toView.removeAttribute('emy-transition');
			}

			if (!("onhashchange" in window)) checkTimer = setInterval(checkLocation, 300);

			setTimeout(updateView, 0, toView, fromView);
			fromView.removeEventListener(emy.prefixedProperty['animationEnd'], slideDone, false);

			if (fromView.getAttribute('data-onexit')) eval(fromView.getAttribute('data-onexit'));
			if (toView.getAttribute('data-onshow')) eval(toView.getAttribute('data-onshow'));

			sendEvent("aftertransition", fromView, {
				out: true
			});
			sendEvent("aftertransition", toView, {
				out: false
			});

			if (backwards) sendEvent("unload", fromView); // EVENT: UNLOAD
		}
	}

	function slideJS(fromView, toView, backwards, cb) {
		toView.style.left = "100%";
		scrollTo(0, 1);
		toView.setAttribute("selected", "true");
		var percent = 100;

		function slide() {
			percent -= slideStep;
			fromView.style.left = (backwards ? (100 - percent) : (percent - 100)) + "%";
			toView.style.left = (backwards ? -percent : percent) + "%";
			if (percent <= 0) {
				clearInterval(slideInterval);
				percent = 0;
				cb();
			}
		}
		var slideInterval = setInterval(slide, slideSpeed);
		slide();
	}

	function slideCSS(fromView, toView, backwards, cb) {
		toView.style.visibility = 'hidden';
		if (!backwards) var transName = (toView.getAttribute('custom-transition')) ? toView.getAttribute('custom-transition') : 'slide';
		else var transName = (fromView.getAttribute('custom-transition')) ? fromView.getAttribute('custom-transition') : 'slide';

		var fromViewTransition = backwards ? (transName + 'backout') : (transName + 'out');
		var toViewTransition = backwards ? (transName + 'backin') : (transName + 'in');
		toView.setAttribute("selected", "true");

		function startTrans() {
			fromView.setAttribute('emy-transition', fromViewTransition);
			toView.setAttribute('emy-transition', toViewTransition);
			toView.style.visibility = '';
		}
		fromView.addEventListener(emy.prefixedProperty['animationEnd'], cb, false);
		setTimeout(startTrans, 1);
	}

	function noSlide(fromView, toView, cb) {
		setTimeout(function() {
			fromView.removeAttribute("selected");
			toView.setAttribute("selected", "true");
			cb();
		}, 1);
	}

	function submitForm(form) {
		emy.addClass(form, "progress");
		sendEvent("beforeformsubmit", document.body, {
			form: form
		})
		emy.showViewByHref(form.getAttribute('action'), encodeForm(form), form.hasAttribute('method') ? form.getAttribute('method') : 'GET', null, function() {
			emy.changeClass(form, 'progress', '');
			cancelDialog(form);
			sendEvent("afterformsubmit", document.body, {
				form: form
			})
		});
	}

	function encodeForm(form) {
		function encode(inputs) {
			for (var i = 0; i < inputs.length; ++i) {
				if (inputs[i].name) {
					var input = inputs[i];
					if (input.getAttribute("type") == "checkbox" && !input.checked || input.getAttribute("type") == "radio" && !input.checked || input.disabled) {
						continue;
					}
					if (input.getAttribute("type") == "submit") {
						if (input.getAttribute("submitvalue")) { // Was marked, this is the value to send, but clear it for next time
							input.removeAttribute("submitvalue");
						} else { // not marked, don't send value -- continue
							continue;
						}
					}
					var value = args[input.name];
					if (value === undefined) { // If parm is 'empty' just set it
						args[input.name] = input.value;
					} else if (value instanceof Array) { // If parm is array, add to it
						value.push(input.value);
					} else { // If parm is scalar, change to array and add to it
						args[input.name] = [value, input.value];
					}
				}
			}
		}

		var args = {};
		encode(form.getElementsByTagName("input"));
		encode(form.getElementsByTagName("textarea"));
		encode(form.getElementsByTagName("select"));
		encode(form.getElementsByTagName("button"));
		return args;
	}

	function findParent(node, localName) {
		while (node && (node.nodeType != 1 || node.localName.toLowerCase() != localName))
		node = node.parentNode;
		return node;
	}

	function replaceElementWithFrag(replace, frag) {
		var parent = replace.parentNode;
		var parentTarget = parent.parentNode;
		parentTarget.removeChild(parent);

		var docNode;
		while (frag.firstChild) {
			docNode = parentTarget.appendChild(frag.firstChild);
			sendEvent("afterinsert", document.body, {
				insertedNode: docNode
			});
		}
		sendEvent("afterinsertend", document.body, {
			fragment: frag
		})
	}

	function preloadImages() {
		var preloader = document.createElement("div");
		preloader.id = "preloader";
		document.body.appendChild(preloader);
	}

	function fitHeight(a) {
		// this script could use a cleanup...
		// to avoid innerHeight with scrollTo(0,0) address hide trick, on afterInserted for ex
		window.scrollTo(0, 0);
		if (screenHeight == 0) var wih = screenHeight;
		else var wih = window.innerHeight;

		// we put this in a timeout to be sure the scrollTo(0,0) is done
		setTimeout(function() {
			var heightVal;
			var toolbarHeight = emy.$('.toolbar')[0].clientHeight;
			var sc = emy.$('body')[0].childNodes;
			if (sc) {
				for (var i = 1; i <= (sc.length - 1); i++) {
					if ((sc[i].id != '') && (sc[i].id != undefined) && (typeof sc[i] === 'object') && !emy.hasClass(sc[i], 'toolbar')) {
						heightVal = wih; /* default value */
						if (window.navigator.standalone === false) { // for iphone
							if (navigator.userAgent.toLowerCase()
								.search('ipad') > -1) heightVal = (wih);
							else if (emy.hasClass(sc[i], 'dialog')) heightVal = (wih + 60);
							else if (screenHeight < 2) heightVal = (wih + 60);
						} else {
							if (navigator.userAgent.toLowerCase()
								.search('android') > -1 && screenHeight == 0) heightVal = (wih + 50);
							else if (navigator.userAgent.toLowerCase()
								.search('firefox') > -1) heightVal = (wih - toolbarHeight);
						}
						sc[i].style.minHeight = heightVal + 'px';
					}
				}
			}
			if (screenHeight == 0) {
				screenHeight = 1;
				fitHeight();
			} else if (screenHeight == 1) {
				screenHeight = heightVal;
			}
			setTimeout(function() {
				window.scrollTo(0, 1)
			}, 1);

		}, 1);

	}

})();
