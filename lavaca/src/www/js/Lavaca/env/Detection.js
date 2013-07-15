define(function(require) {
  var $ = require('$');
  var Detection = {};
  Detection.agent = navigator.userAgent.toLowerCase();
  Detection.scrWidth = screen.width;
  Detection.scrHeight = screen.height;
  Detection.viewportWidth = window.innerWidth;
  Detection.viewportHeight = window.innerHeight;
  Detection.elemWidth = document.documentElement.clientWidth;
  Detection.elemHeight = document.documentElement.clientHeight;
  Detection.otherBrowser = (Detection.agent.search(/series60/i) > -1) || (Detection.agent.search(/symbian/i) > -1) || (Detection.agent.search(/windows\sce/i) > -1) || (Detection.agent.search(/blackberry/i) > -1);
  Detection.mobileOS = typeof orientation !== 'undefined';
  Detection.touchOS = 'ontouchstart' in document.documentElement;
  Detection.blackberry = Detection.agent.search(/blackberry/i) > -1;
  Detection.ipad = Detection.agent.search(/ipad/i) > -1;
  Detection.ipod = Detection.agent.search(/ipod/i) > -1;
  Detection.iphone = Detection.agent.search(/iphone/i) > -1;
  Detection.palm = Detection.agent.search(/palm/i) > -1;
  Detection.symbian = Detection.agent.search(/symbian/i) > -1;
  Detection.iOS = Detection.iphone || Detection.ipod || Detection.ipad;
  Detection.iOS5 = Detection.iOS && Detection.agent.search(/os 5_/i) > 0;
  Detection.iOSChrome = Detection.iOS && Detection.agent.search(/CriOS/i) > 0;
  Detection.android = (Detection.agent.search(/android/i) > -1) || (!Detection.iOS && !Detection.otherBrowser && Detection.touchOS && Detection.mobileOS);
  Detection.android2 = Detection.android && (Detection.agent.search(/android\s2/i) > -1);
  Detection.isMobile = Detection.android || Detection.iOS || Detection.mobileOS || Detection.touchOS;
  Detection.android23AndBelow = (function() {
    var matches = Detection.agent.match(/android\s(\d)\.(\d)/i);
    var vi, vd;
    if (Array.isArray(matches) && matches.length === 3) {
      vi = parseInt(matches[1], 10);
      vd = parseInt(matches[2], 10);
      return (vi === 2 && vd < 3) || vi < 2;
    }
    return false;
  }());
  Detection.iOS4AndBelow = (function() {
    var matches = Detection.agent.match(/os\s(\d)_/i);
    var v;
    if (Array.isArray(matches) && matches.length === 2) {
      v = parseInt(matches[1], 10);
      return v <= 4;
    }
    return false;
  }());
  Detection.addCustomDetection = function(condition, feature, selector) {
    var el;
    if (Detection.hasOwnProperty(feature)) {
      throw Error('Namespace "' + feature + '" is already taken by Detection module');
    }
    Detection[feature] = condition;
    if (selector !== null) {
      el = selector ? $(selector) : $(document.documentElement);
      el.toggleClass(feature, typeof condition === 'function' ? condition() : condition);
    }
  };
  Detection.animationEnabled = true;
  return Detection;
});