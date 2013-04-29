var app = new $.mvc.app();

app.loadControllers(["searchService", "search", "results", "favourites", "formatter"]);
app.loadModels(["property", "recentSearch", "favourites"]);
