import 'reflect-metadata';
import { Component, OnInit } from "angular2/core";
import {Router} from "angular2/router";
import {topmost} from "ui/frame";
import {ActionBar} from "ui/action-bar";
import {Observable} from "rxjs/Observable";
import {ObservableArray} from "data/observable-array";
import {Config} from "../config";
import {SearchService} from "../services/search-service";
import { Listing } from "../models/listing";
import { SimpleLocation } from "../models/simple-location";
import { SearchResultsModel } from "../models/search-results-model";
import { PoundPipe } from "../pipes/pound-pipe";

@Component({
    selector: "search-results",
    templateUrl: "views/search-results.xml",
    styleUrls: ["styles/search-results.css"],
    pipes: [PoundPipe],
    providers: [SearchService]
})
export class SearchResultsComponent implements OnInit {
    public searchResults: Array<Listing> = [];
    private searchLocation: SimpleLocation;
    public totalResults: number;
    private currentPage: number;
    public isLoadingMore: boolean;
    
    constructor(private _router: Router, private _searchResultsModel: SearchResultsModel, private _searchService: SearchService) { }
    
    ngOnInit() {
        this._searchResultsModel.results$.subscribe(results => {
            this.searchResults = [];
            results.listings.forEach(listing => this.searchResults.push(listing));
            this.searchLocation = results.location;
            this.totalResults = results.totalResults; 
            this.currentPage = results.currentPage;
            this.isLoadingMore = false;      
        });
        this._searchResultsModel.get();
    }
    
    displayDetails(listing:Listing) {
        this._router.navigate(["Details", {guid: listing.guid, fromFavs: false}]);
    }
    
    loadMore() {
        if(this.isLoadingMore || this.searchResults.length === this.totalResults) {  
            return;
        }
        this.isLoadingMore = true;
        let response = <Observable<any>> this._searchService.search(this.searchLocation.key, this.currentPage + 1);
        response.subscribe(res => {
             if(res.application_response_code === "100" || res.application_response_code === "101" || res.application_response_code === "110") {
                if (res.listings.length > 0) {
                    this._searchResultsModel.add(res.listings.map(listing => { return {
                        guid: listing.guid,
                        title: listing.title,
                        bathroom_number: listing.bathroom_number,
                        bedroom_number: listing.bedroom_number,
                        img_url: listing.img_url,
                        price: listing.price,
                        price_currency: listing.price_currency,
                        summary: listing.summary
                    }}));
                }
            }
        },
        err => { 
            console.error("An error occured: " + err);
        });

    }
    
    loadingButtonEnabled(): boolean {
        return !this.isLoadingMore && this.searchResults.length < this.totalResults;
    } 

}