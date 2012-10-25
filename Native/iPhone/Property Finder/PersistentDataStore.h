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

@interface PersistentDataStore : NSObject

@property (readonly) NSArray* recentSearches;

@property (readonly) NSArray* favourites;

- (void) addToRecentSearches: (SearchItemBase*) searchItem;

- (id) initWithObjectContext: (NSManagedObjectContext*) context;

- (void) toggleFavourite: (Property*) property;

- (BOOL) isPropertyFavourited: (Property*) property;

+ (id) persistentDataStoreWithObjectContext: (NSManagedObjectContext*) context;

@end
