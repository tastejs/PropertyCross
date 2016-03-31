import 'reflect-metadata';
import { Inject, Component } from "angular2/core";
import {Router} from "angular2/router";
import {Observable} from "rxjs/Observable";
import {Location, getCurrentLocation, isEnabled, enableLocationRequest } from "nativescript-geolocation";
import {SearchService} from "../services/search-service";
import {RecentSearchService} from "../services/recent-search-service"
import {SearchResultsModel} from "../models/search-results-model";
import { SimpleLocation } from "../models/simple-location";
import { RecentSearchItem } from "../models/recent-search-item";

@Component({
    selector: "property-search",
    templateUrl: "views/property-search.xml",
    styleUrls: ["styles/property-search.css"],
    providers: [SearchService, RecentSearchService]
})
export class PropertySearchComponent {
    public location: SimpleLocation;
    public introduction: string;
    public recentLocations: Array<RecentSearchItem>;
    public proposedLocations: Array<SimpleLocation>;
    public error: boolean;
    public errorMessage: string;
    public locationProposal: boolean;
    public isSearching: boolean;
    
    constructor(private _searchService: SearchService, private _recentSearchService: RecentSearchService, private _router: Router, private _searchResultsModel: SearchResultsModel) {
        this.introduction = "Use the form below to search for houses to buy. You can search by place-name, postcode, or click 'My location', to search in your current location!";
        this.recentLocations = this._recentSearchService.getRecentSearches();
        this.location = { key: "", name: "" };
    }
    
    search() {
        this.error = false;
        this.locationProposal = false;
        this.proposedLocations = [];
        if (this.location.key === "") {
            this.location.key = this.location.name;
        }
        if (this.location.key != "") {
            this.isSearching = true;
            let response = <Observable<any>> this._searchService.search(this.location.key);
            this.processSearchResponse(response);       
        }  
    }
    
    repeatRecentSearch(recent: RecentSearchItem) {
        this.location = recent.location;
        this.search();
    }
    
    searchProposedLocation(proposed: SimpleLocation) {
        this.location = proposed;
        this.search();
    }
    
    
    searchByGeoLocation(geoLocation: Location) {
        this.error = false;
        if (geoLocation) {
            let response = <Observable<any>> this._searchService.searchByCoords(geoLocation.latitude, geoLocation.longitude);
            this.processSearchResponse(response);
        }
    }
    
    determineLocation() {
        if(!isEnabled()) {
            enableLocationRequest();
        }
        let location = getCurrentLocation({desiredAccuracy: 3, updateDistance: 10, maximumAge: 20000, timeout: 20000})
            .then( loc => {
                this.searchByGeoLocation(loc);
             },
             error => {
                 this.error = true;
                 this.errorMessage = "Unable to detect current location. Please ensure location is turned on in your phone settings and try again.";
             });
    }
    
    private processSearchResponse(response: Observable<any>) {
        response.subscribe(res => {
            if(res.application_response_code === "100" || res.application_response_code === "101" || res.application_response_code === "110") {
                if (res.listings.length > 0) {
                    let location: SimpleLocation = { key: res.locations[0].place_name, name: res.locations[0].long_title }
                    this.addRecentLocation({ location: location, results: res.total_results });
                    this._searchResultsModel.set(location, res.listings.map(listing => { return {
                        guid: listing.guid,
                        title: listing.title,
                        bathroom_number: listing.bathroom_number,
                        bedroom_number: listing.bedroom_number,
                        img_url: listing.img_url,
                        price: listing.price,
                        price_currency: listing.price_currency,
                        summary: listing.summary
                    }}), res.total_results);
                    this.location = { key: "", name: ""};
                    this._router.navigate(["SearchResults"]);
                } else {
                    this.error = true;
                    this.errorMessage = "There were no properties found for the given location.";
                    this.location.key = "";
                }
            } else if(res.application_response_code === "200" || res.application_response_code === "202") {
                this.locationProposal = true;
                res.locations.forEach(propLocation => this.proposedLocations.push({ key: propLocation.place_name, name: propLocation.long_title }));  
                this.location.key = "";
            } else {
                this.error = true;
                this.errorMessage = "There has been a problem with your search.";
                this.location.key = "";
            }
        },
        err => { 
            this.error = true;
            this.errorMessage = "There has been a problem with your search.";
            this.location.key = "";
        },
        () => this.isSearching = false);
    }
    
    private addRecentLocation(item: RecentSearchItem) {
        this._recentSearchService.addRecentSearch(item);
        this.recentLocations = this._recentSearchService.getRecentSearches();
    }
    
    goToFavourites() {
        this._router.navigate(["Favourites"]); 
    }
}
