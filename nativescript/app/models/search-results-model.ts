import {Injectable} from "angular2/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/share';
import { Listing } from "./listing";
import { SimpleLocation } from "./simple-location";
import { SearchResults } from "./search-results";

@Injectable()
export class SearchResultsModel {
    
    results$: Observable<SearchResults>;
    
    private _resultsObserver: any;
    private _resultsStore: {
        results: SearchResults;
    }
    
    constructor() {
        this.results$ = new Observable<SearchResults>(observer => { this._resultsObserver = observer; } ).share();
        // Create observer
        this.results$.subscribe();
        this._resultsStore = { results: { location: null, listings: [], totalResults: 0, currentPage: 0 } };
    }

    set(location: SimpleLocation, listings: Listing[], numResults: number) {
        this._resultsStore.results = { location: location, listings: listings, totalResults: numResults, currentPage: 1 };
        this._resultsObserver.next(this._resultsStore.results);
        
    }
    
    add(listings: Listing[]) {
        this._resultsStore.results.listings = this._resultsStore.results.listings.concat(listings);
        this._resultsStore.results.currentPage++;
        this._resultsObserver.next(this._resultsStore.results);
    }
    
    get() {
        this._resultsObserver.next(this._resultsStore.results);
    }
    
    getListingByGuid(guid: string): Listing {
        const listing = this._resultsStore.results.listings.filter(listing => listing.guid === guid);
        if (listing.length > 0) {
            return listing[0];
        }
        return undefined;
    } 

}