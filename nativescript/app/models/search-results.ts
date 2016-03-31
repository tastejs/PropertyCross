import { Listing } from "./listing";
import { SimpleLocation } from "./simple-location";

export interface SearchResults {
    location: SimpleLocation;
    listings: Array<Listing>;
    totalResults: number;
    currentPage: number;
}