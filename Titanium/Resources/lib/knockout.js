define("lib/knockout", ["lib/knockout-2.1.0"], function (ko) {
  // This file is a hack to ensure that despite the AMD code
  // included in Knockout.js, window.ko is appropriately bound
  // so that jquery.tmpl works as expected.
  window.ko = window.ko || ko;
  return window.ko;
});