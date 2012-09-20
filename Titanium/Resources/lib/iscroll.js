define("lib/iscroll", ["lib/iscroll-4.1.9"], function () {
  // This file wraps iscroll into an AMD compatible module.
  var iScroll = window.iScroll;
  delete window.iScroll;
  return iScroll;
});