/**
 * @private
 */
Ext.define('Ext.event.publisher.Dom', {
    extend: 'Ext.event.publisher.Publisher',

    requires: [
        'Ext.env.Browser',
        'Ext.Element',
        'Ext.event.Dom'
    ],

    targetType: 'element',

    idOrClassSelectorRegex: /^([#|\.])([\w\-]+)$/,

    handledEvents: ['focus', 'blur', 'paste', 'input', 'change',
                    'keyup', 'keydown', 'keypress', 'submit',
                    'transitionend', 'animationstart', 'animationend'],

    classNameSplitRegex: /\s+/,

    SELECTOR_ALL: '*',

    constructor: function() {
        var eventNames = this.getHandledEvents(),
            eventNameMap = {},
            i, ln, eventName, vendorEventName;

        this.doBubbleEventsMap = {
            'click': true,
            'submit': true,
            'mousedown': true,
            'mousemove': true,
            'mouseup': true,
            'mouseover': true,
            'mouseout': true,
            'transitionend': true
        };

        this.onEvent = Ext.Function.bind(this.onEvent, this);

        for (i = 0,ln = eventNames.length; i < ln; i++) {
            eventName = eventNames[i];
            vendorEventName = this.getVendorEventName(eventName);
            eventNameMap[vendorEventName] = eventName;

            this.attachListener(vendorEventName);
        }

        this.eventNameMap = eventNameMap;

        return this.callParent();
    },

    getSubscribers: function(eventName) {
        var subscribers = this.subscribers,
            eventSubscribers = subscribers[eventName];

        if (!eventSubscribers) {
            eventSubscribers = subscribers[eventName] = {
                id: {
                    $length: 0
                },
                className: {
                    $length: 0
                },
                selector: [],
                all: 0,
                $length: 0
            }
        }

        return eventSubscribers;
    },

    getVendorEventName: function(eventName) {
        if (Ext.browser.is.WebKit) {
            if (eventName === 'transitionend') {
                eventName = Ext.browser.getVendorProperyName('transitionEnd');
            }
            else if (eventName === 'animationstart') {
                eventName = Ext.browser.getVendorProperyName('animationStart');
            }
            else if (eventName === 'animationend') {
                eventName = Ext.browser.getVendorProperyName('animationEnd');
            }
        }

        return eventName;
    },

    bindListeners: function (doc, bind) {
        var handlesEvents = this.getHandledEvents(),
            handlesEventsLength = handlesEvents.length,
            i;

        for (i = 0; i < handlesEventsLength; i++) {
            this.bindListener(doc, this.getVendorEventName(handlesEvents[i]), bind);
        }
    },

    bindListener: function (doc, eventName, bind) {
        if (bind) {
            this.attachListener(eventName, doc);
        } else {
            this.removeListener(eventName, doc);
        }
        return this
    },

    attachListener: function(eventName, doc) {
        if (!doc) {
            doc = document;
        }

        var defaultView = doc.defaultView;

        if (Ext.os.is.iOS && Ext.os.version.getMajor() < 5) {
            document.addEventListener(eventName, this.onEvent, !this.doesEventBubble(eventName));
        }
        else if (defaultView && defaultView.addEventListener) {
            doc.defaultView.addEventListener(eventName, this.onEvent, !this.doesEventBubble(eventName));
        }
        else {
            doc.addEventListener(eventName, this.onEvent, !this.doesEventBubble(eventName));
        }
        return this;
    },

    removeListener: function(eventName, doc) {
        if (!doc) {
            doc = document;
        }

        var defaultView = doc.defaultView;

        if (Ext.os.is.iOS && Ext.os.version.getMajor() < 5) {
            document.removeEventListener(eventName, this.onEvent, !this.doesEventBubble(eventName));
        }
        else if (defaultView && defaultView.addEventListener) {
            doc.defaultView.removeEventListener(eventName, this.onEvent, !this.doesEventBubble(eventName));
        }
        else {
            doc.removeEventListener(eventName, this.onEvent, !this.doesEventBubble(eventName));
        }
        return this;
    },

    doesEventBubble: function(eventName) {
        return !!this.doBubbleEventsMap[eventName];
    },

    subscribe: function(target, eventName) {
        if (!this.handles(eventName)) {
            return false;
        }

        var idOrClassSelectorMatch = target.match(this.idOrClassSelectorRegex),
            subscribers = this.getSubscribers(eventName),
            idSubscribers = subscribers.id,
            classNameSubscribers = subscribers.className,
            selectorSubscribers = subscribers.selector,
            type, value;

        if (idOrClassSelectorMatch !== null) {
            type = idOrClassSelectorMatch[1];
            value = idOrClassSelectorMatch[2];

            if (type === '#') {
                if (idSubscribers.hasOwnProperty(value)) {
                    idSubscribers[value]++;
                    return true;
                }

                idSubscribers[value] = 1;
                idSubscribers.$length++;
            }
            else {
                if (classNameSubscribers.hasOwnProperty(value)) {
                    classNameSubscribers[value]++;
                    return true;
                }

                classNameSubscribers[value] = 1;
                classNameSubscribers.$length++;
            }
        }
        else {
            if (target === this.SELECTOR_ALL) {
                subscribers.all++;
            }
            else {
                if (selectorSubscribers.hasOwnProperty(target)) {
                    selectorSubscribers[target]++;
                    return true;
                }

                selectorSubscribers[target] = 1;
                selectorSubscribers.push(target);
            }
        }

        subscribers.$length++;

        return true;
    },

    unsubscribe: function(target, eventName, all) {
        if (!this.handles(eventName)) {
            return false;
        }

        var idOrClassSelectorMatch = target.match(this.idOrClassSelectorRegex),
            subscribers = this.getSubscribers(eventName),
            idSubscribers = subscribers.id,
            classNameSubscribers = subscribers.className,
            selectorSubscribers = subscribers.selector,
            type, value;

        all = Boolean(all);

        if (idOrClassSelectorMatch !== null) {
            type = idOrClassSelectorMatch[1];
            value = idOrClassSelectorMatch[2];

            if (type === '#') {
                if (!idSubscribers.hasOwnProperty(value) || (!all && --idSubscribers[value] > 0)) {
                    return true;
                }

                delete idSubscribers[value];
                idSubscribers.$length--;
            }
            else {
                if (!classNameSubscribers.hasOwnProperty(value) || (!all && --classNameSubscribers[value] > 0)) {
                    return true;
                }

                delete classNameSubscribers[value];
                classNameSubscribers.$length--;
            }
        }
        else {
            if (target === this.SELECTOR_ALL) {
                if (all) {
                    subscribers.all = 0;
                }
                else {
                    subscribers.all--;
                }
            }
            else {
                if (!selectorSubscribers.hasOwnProperty(target) || (!all && --selectorSubscribers[target] > 0)) {
                    return true;
                }

                delete selectorSubscribers[target];
                Ext.Array.remove(selectorSubscribers, target);
            }
        }

        subscribers.$length--;

        return true;
    },

    getElementTarget: function(target) {
        if (target.nodeType !== 1) {
            target = target.parentNode;

            if (!target || target.nodeType !== 1) {
                return null;
            }
        }

        return target;
    },

    getBubblingTargets: function(target) {
        var targets = [];

        if (!target) {
            return targets;
        }

        do {
            targets[targets.length] = target;

            target = target.parentNode;
        } while (target && target.nodeType === 1);

        return targets;
    },

    dispatch: function(target, eventName, args) {
        args.push(args[0].target);
        this.callParent(arguments);
    },

    publish: function(eventName, targets, event) {
        var subscribers = this.getSubscribers(eventName),
            wildcardSubscribers;

        if (subscribers.$length === 0 || !this.doPublish(subscribers, eventName, targets, event)) {
            wildcardSubscribers = this.getSubscribers('*');

            if (wildcardSubscribers.$length > 0) {
                this.doPublish(wildcardSubscribers, eventName, targets, event);
            }
        }

        return this;
    },

    doPublish: function(subscribers, eventName, targets, event) {
        var idSubscribers = subscribers.id,
            classNameSubscribers = subscribers.className,
            selectorSubscribers = subscribers.selector,
            hasIdSubscribers = idSubscribers.$length > 0,
            hasClassNameSubscribers = classNameSubscribers.$length > 0,
            hasSelectorSubscribers = selectorSubscribers.length > 0,
            hasAllSubscribers = subscribers.all > 0,
            isClassNameHandled = {},
            args = [event],
            hasDispatched = false,
            classNameSplitRegex = this.classNameSplitRegex,
            i, ln, j, subLn, target, id, className, classNames, selector;

        for (i = 0,ln = targets.length; i < ln; i++) {
            target = targets[i];
            event.setDelegatedTarget(target);

            if (hasIdSubscribers) {
                // We use getAttribute instead of referencing id here as forms can have there properties overridden by children
                // Example:
                //  <form id="myForm">
                //      <input name="id">
                //  </form>
                // form.id === input node named id whereas form.getAttribute("id") === "myForm"
                id = target.getAttribute("id");

                if (id) {
                    if (idSubscribers.hasOwnProperty(id)) {
                        hasDispatched = true;
                        this.dispatch('#' + id, eventName, args);
                    }
                }
            }

            if (hasClassNameSubscribers) {
                className = target.className;

                if (className) {
                    classNames = className.split(classNameSplitRegex);

                    for (j = 0,subLn = classNames.length; j < subLn; j++) {
                        className = classNames[j];

                        if (!isClassNameHandled[className]) {
                            isClassNameHandled[className] = true;

                            if (classNameSubscribers.hasOwnProperty(className)) {
                                hasDispatched = true;
                                this.dispatch('.' + className, eventName, args);
                            }
                        }
                    }
                }
            }

            // Stop propagation
            if (event.isStopped) {
                return hasDispatched;
            }
        }

        if (hasAllSubscribers && !hasDispatched) {
            event.setDelegatedTarget(event.browserEvent.target);
            hasDispatched = true;
            this.dispatch(this.SELECTOR_ALL, eventName, args);
            if (event.isStopped) {
                return hasDispatched;
            }
        }

        if (hasSelectorSubscribers) {
            for (j = 0,subLn = targets.length; j < subLn; j++) {
                target = targets[j];

                for (i = 0,ln = selectorSubscribers.length; i < ln; i++) {
                    selector = selectorSubscribers[i];

                    if (this.matchesSelector(target, selector)) {
                        event.setDelegatedTarget(target);
                        hasDispatched = true;
                        this.dispatch(selector, eventName, args);
                    }

                    if (event.isStopped) {
                        return hasDispatched;
                    }
                }
            }
        }

        return hasDispatched;
    },

    matchesSelector: function() {
        var test = Element.prototype,
            matchesSelector =
                ('webkitMatchesSelector' in test) ? 'webkitMatchesSelector' :
                (('msMatchesSelector' in test) ? 'msMatchesSelector' : ('mozMatchesSelector' in test ? 'mozMatchesSelector' : null));

        if (matchesSelector) {
            return function(element, selector) {
                return element[matchesSelector](selector);
            }
        }

        return function(element, selector) {
            Ext.DomQuery.is(element, selector);
        }
    }(),

    onEvent: function(e) {
        var eventName = this.eventNameMap[e.type];
        // Set the current frame start time to be the timestamp of the event.
        Ext.frameStartTime = e.timeStamp;

        if (!eventName || this.getSubscribersCount(eventName) === 0) {
            return;
        }

        var target = this.getElementTarget(e.target),
            targets;

        if (!target) {
            return;
        }

        if (this.doesEventBubble(eventName)) {
            targets = this.getBubblingTargets(target);
        }
        else {
            targets = [target];
        }

        this.publish(eventName, targets, new Ext.event.Dom(e));
    },

    //<debug>
    hasSubscriber: function(target, eventName) {
        if (!this.handles(eventName)) {
            return false;
        }

        var match = target.match(this.idOrClassSelectorRegex),
            subscribers = this.getSubscribers(eventName),
            type, value;

        if (match !== null) {
            type = match[1];
            value = match[2];

            if (type === '#') {
                return subscribers.id.hasOwnProperty(value);
            }
            else {
                return subscribers.className.hasOwnProperty(value);
            }
        }
        else {
            return (subscribers.selector.hasOwnProperty(target) && Ext.Array.indexOf(subscribers.selector, target) !== -1);
        }

        return false;
    },
    //</debug>

    getSubscribersCount: function(eventName) {
        if (!this.handles(eventName)) {
            return 0;
        }

        return this.getSubscribers(eventName).$length + this.getSubscribers('*').$length;
    }

});