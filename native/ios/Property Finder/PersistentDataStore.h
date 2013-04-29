//
//  PersistentDataStore.h
//  Property Finder
//
//  Created by Colin Eberhardt on 25/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SearchItemBase.h"
#import "Property.h"

// provides the property finder with a list of recent searches and favourites. The
// state of both of these arrays is persisted
@interface PersistentDataStore : NSObject

// gets a list of recent searches
@property (readonly) NSArray* recentSearches;

// gets a list of favourte properties
@property (readonly) NSArray* favourites;

// adds the given search item to the list of recent searches
- (void) addToRecentSearches: (SearchItemBase*) searchItem;

// toggles the favourite state of a property
- (void) toggleFavourite: (Property*) property;

// gets whether a property is favourited
- (BOOL) isPropertyFavourited: (Property*) property;

// initializes with the given context
- (id) initWithObjectContext: (NSManagedObjectContext*) context;
+ (id) persistentDataStoreWithObjectContext: (NSManagedObjectContext*) context;

@end
