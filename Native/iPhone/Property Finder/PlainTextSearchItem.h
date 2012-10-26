//
//  PlainTextSearchItem.h
//  Property Finder
//
//  Created by Colin Eberhardt on 24/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "SearchItemBase.h"
#import "Location.h"

// a search for a plain text string. This search has two components, the displayed value and the
// actual search value, this is because the property database is able to return a match of best-guess
// locations which have both a human-readble description and the actual search string used to query the
// database.
@interface PlainTextSearchItem : SearchItemBase

// the text that is used to search the property database.
@property NSString* searchText;

// factory method
+ (id) plainTextSearchItemFromString: (NSString*) searchTerm;

// factory methods
+ (id) plainTextSearchItemFromLocation: (Location*) location;

@end
