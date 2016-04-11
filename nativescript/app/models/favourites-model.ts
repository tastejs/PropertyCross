import { setString, getString } from "application-settings";
import {Injectable} from "angular2/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/share';
import { Listing } from "./listing";

@Injectable()
export class FavouritesModel {
    
    favourites$: Observable<Array<Listing>>;
    
    private _favouritesObserver: any;
    private _favouritesStore: {
        listings: Array<Listing>;
    } 
    
    constructor() {
        this.favourites$ = new Observable<Array<Listing>>(observer => { this._favouritesObserver = observer; } ).share();
        // Create observer
        this.favourites$.subscribe();
        
        this._favouritesStore = { listings: [] } ;
        this.load();
    }

    add(listing: Listing) {
        this._favouritesStore.listings.push(listing);
        this._favouritesObserver.next(this._favouritesStore.listings);
        this.save();
    }
    
    remove(listing: Listing) {
        const index = this._favouritesStore.listings.findIndex(fav => fav.guid === listing.guid);
        if (index != -1) {
            this._favouritesStore.listings.splice(index, 1);
            console.log(JSON.stringify(this._favouritesStore.listings));
        }
        this._favouritesObserver.next(this._favouritesStore.listings);
        this.save();
    }
    
    get() {
        this._favouritesObserver.next(this._favouritesStore.listings);
    }
    
    isInFavourites(listing: Listing): boolean {
        return this._favouritesStore.listings.findIndex(fav => fav.guid === listing.guid) != -1;
    }
    
    getListingByGuid(guid: string): Listing {
        const listing = this._favouritesStore.listings.filter(listing => listing.guid === guid);
        if (listing.length > 0) {
            return listing[0];
        }
        return undefined;
    } 
    
    private save() {
        setString("favourites", JSON.stringify(this._favouritesStore.listings));
    }
    
    private load() {
        const favouritesString = getString("favourites");
        if(favouritesString) {
            this._favouritesStore.listings = <Array<Listing>>JSON.parse(favouritesString);
        } else {
            this._favouritesStore.listings = [];
        }
    }

}