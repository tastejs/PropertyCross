import { nativeScriptBootstrap } from "nativescript-angular/application";
import { HTTP_PROVIDERS } from 'angular2/http';
import { NS_ROUTER_PROVIDERS } from "nativescript-angular/router";
import { PropertyCrossComponent } from "./property-cross";
import { SearchResultsModel } from "./models/search-results-model";
import { FavouritesModel } from "./models/favourites-model";

nativeScriptBootstrap(PropertyCrossComponent, [HTTP_PROVIDERS, NS_ROUTER_PROVIDERS, SearchResultsModel, FavouritesModel]);