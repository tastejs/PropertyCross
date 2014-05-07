/*globals kendo, document, TwitterSearchViewModel, SearchResultsViewModel, TweetViewModel  */

// create the mobile app
var app = new kendo.mobile.Application(document.body, { transition: "slide" });

var formatter = new Formatter();
var favouritesService = new FavouritesService();
var searchViewModel = new SearchViewModel();
var resultsViewModel = new ResultsViewModel();
var propertyViewModel = new PropertyViewModel();
var favouritesViewModel = new FavouritesViewModel();

document.addEventListener("deviceready", function() {
    if (navigator.splashscreen) {
      navigator.splashscreen.hide();
    }
}, false);

