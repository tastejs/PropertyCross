//
//  SearchItemBase.h
//  Property Finder
//
//  Created by Colin Eberhardt on 24/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PropertyDataSource.h"
#import "RecentSearchDataEntity.h"

// represents a search that can be executed. This search might be plain-text or geolocation based.
@interface SearchItemBase : NSObject

// the human-readble description of this search.
@property NSString* displayText;

// teh number of matching properties
@property NSNumber* matches;

// executes the search that this item represents
-(void) findPropertiesWithDataSource:(PropertyDataSource*) propertyDataSource
                          pageNumber:(NSNumber *)page
                              result:(PropertyDataSourceResultSuccess) successResult
                               error:(PropertyDataSourceResultError)errorResult;

// copies the state of this search to the given entity
-(void) toRecentSearchDataEntity: (RecentSearchDataEntity*) entity;

// creates a search item from the given entity
+ (id) fromRecentSearchDataEntity: (RecentSearchDataEntity*) entity;

@end
