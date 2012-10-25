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

@interface SearchItemBase : NSObject

@property NSString* displayText;

-(void) findPropertiesWithDataSource: (PropertyDataSource*) propertyDataSource result:(PropertyDataSourceResultSuccess) successResult;

-(void) toRecentSearchDataEntity: (RecentSearchDataEntity*) entity;

+ (id) fromRecentSearchDataEntity: (RecentSearchDataEntity*) entity;


@end
