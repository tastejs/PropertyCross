import 'reflect-metadata';
import { Component, OnInit } from "angular2/core";
import { Router } from "angular2/router";
import { PoundPipe } from "../pipes/pound-pipe";
import { Listing } from "../models/listing";
import { FavouritesModel } from "../models/favourites-model";
 
@Component({
    selector: "favourites",
    templateUrl: "views/favourites.xml",
    styleUrls: ["styles/favourites.css"],
    pipes: [PoundPipe]
})
export class FavouritesComponent implements OnInit {
    
    public favourites: Array<Listing> = [];
    
    constructor(private _favouritesModel: FavouritesModel, private _router: Router) {}

    ngOnInit() {
        this._favouritesModel.favourites$.subscribe(favourites => this.resetFavourites(favourites));
        this._favouritesModel.get();
    }
    
    private resetFavourites(favs: Array<Listing>) {
        this.favourites = [];
        favs.forEach(listing => this.favourites.push(listing));
    }
    
    displayDetails(listing: Listing) {
        this._router.navigate(["Details", {guid: listing.guid, fromFavs: true}]);
    }
}