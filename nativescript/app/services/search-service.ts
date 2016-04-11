import 'reflect-metadata';
import {Injectable} from "angular2/core";
import {Http, Headers, URLSearchParams, Response} from "angular2/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import {Config} from "../config";
import { Listing } from "../models/listing";

@Injectable()
export class SearchService {
    
    constructor(private _http: Http) {}
    
    search(location: string, page: number = 1) : Observable<any> {
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.append("country", "uk");
        searchParams.append("pretty", "1");
        searchParams.append("action", "search_listings");
        searchParams.append("encoding", "json");
        searchParams.append("listing_type", "buy");
        searchParams.append("page", page.toString());
        searchParams.append("place_name", location);
        const response: Observable<Response> = this._http.get(Config.apiUrl, { search: searchParams });
        return response.map(res => res.json()).map(
                data => data.response
                );
       }  
       
      searchByCoords(latitude: number, longitude: number, page: number = 1) : Observable<any> {
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.append("country", "uk");
        searchParams.append("pretty", "1");
        searchParams.append("action", "search_listings");
        searchParams.append("encoding", "json");
        searchParams.append("listing_type", "buy");
        searchParams.append("page", page.toString());
        searchParams.append("centre_point", "" + latitude + "," + longitude);
        const response: Observable<Response> = this._http.get(Config.apiUrl, { search: searchParams });
        return response.map(res => res.json()).map(
                data => data.response
                );
       }     
}