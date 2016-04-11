import { setString, getString } from "application-settings";
import {Injectable} from "angular2/core";
import { RecentSearchItem } from "../models/recent-search-item";

@Injectable()
export class RecentSearchService {
    private recentSearches: RecentSearchItem[];
    
    constructor() {
        this.getRecentSearches();
    }
    
    addRecentSearch(recentSearch: RecentSearchItem) {
        this.recentSearches = this.recentSearches.filter(loc => loc.location.key != recentSearch.location.key );
        this.recentSearches.unshift(recentSearch);
        if(this.recentSearches.length > 5) {
            this.recentSearches.pop();
        }
        this.save();
    }
    
    getRecentSearches(): RecentSearchItem[] {
        const recentSearchString = this.load();
        if(recentSearchString) {
            this.recentSearches = <Array<RecentSearchItem>>JSON.parse(recentSearchString);
        } else {
            this.recentSearches = [];
        }
        return this.recentSearches;
    }
    
    private save() {
        setString("recentSearches", JSON.stringify(this.recentSearches));
    }
    
    private load(): string {
        return getString("recentSearches");
    }
}