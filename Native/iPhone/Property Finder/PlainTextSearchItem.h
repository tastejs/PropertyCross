//
//  PlainTextSearchItem.h
//  Property Finder
//
//  Created by Colin Eberhardt on 24/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "SearchItemBase.h"
#import "Location.h"


@interface PlainTextSearchItem : SearchItemBase

@property NSString* searchText;

+ (id) plainTextSearchItemFromString: (NSString*) searchTerm;

+ (id) plainTextSearchItemFromLocation: (Location*) location;

@end
