import 'reflect-metadata'
import {Component} from "angular2/core";
import {RouteConfig} from "angular2/router";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";

import {PropertySearchComponent} from "./components/property-search.component";
import {SearchResultsComponent} from "./components/search-results.component";
import {PropertyListingComponent} from "./components/property-listing.component";
import {FavouritesComponent} from "./components/favourites.component";

@Component({
    selector: "property-cross",
    directives: [NS_ROUTER_DIRECTIVES],
    template: "<StackLayout><page-router-outlet></page-router-outlet></StackLayout>"
})
@RouteConfig([
    { path: "/", component: PropertySearchComponent, as: "PropertySearch" },
    { path: "/Results", component: SearchResultsComponent, as: "SearchResults" },
    { path: "/Details/:guid/:fromFavs", component: PropertyListingComponent, as: "Details"},
    { path: "/Favourites", component: FavouritesComponent, as: "Favourites"}
])
export class PropertyCrossComponent {}