import 'reflect-metadata';
import { Component } from "angular2/core";
import {RouteParams} from "angular2/router";
import { Listing } from "../models/listing";
import { SearchResultsModel } from "../models/search-results-model";
import { PoundPipe } from "../pipes/pound-pipe";
import { FavouritesModel } from "../models/favourites-model";

@Component({
    selector: "property-listing",
    templateUrl: "views/property-listing.xml",
    styleUrls: ["styles/property-listing.css"],
    pipes: [PoundPipe]
})
export class PropertyListingComponent {
    public listing: Listing;
    public rooms: string;
    
    constructor(private _routeParams:RouteParams, private _searchResultsModel: SearchResultsModel, private _favouritesModel: FavouritesModel) {
        let guid = this._routeParams.get('guid');
        let fromFavourites = this._routeParams.get('fromFavs');
        if(fromFavourites) {
            this.listing = _favouritesModel.getListingByGuid(guid);
        } else {
            this.listing = _searchResultsModel.getListingByGuid(guid);
        }
        let bedroomSuffix = (this.listing.bedroom_number > 1) ? "s" : "";
        let bathroomSuffix = (this.listing.bathroom_number > 1) ? "s" : ""
        this.rooms = this.listing.bedroom_number + " bedroom" + bedroomSuffix + ", " + this.listing.bathroom_number + " bathroom" + bathroomSuffix;
     }
    
    addToFavourites() {
        this._favouritesModel.add(this.listing);
    }
    
    removeFromFavourites() {
        this._favouritesModel.remove(this.listing);
    }
    
    isFavourite(): boolean {
        return this._favouritesModel.isInFavourites(this.listing);
    }
}