//
//  SearchItemBase.m
//  PropertyCross
//
//  Created by Colin Eberhardt on 24/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "SearchItemBase.h"
#import "PlainTextSearchItem.h"
#import "GeolocationSearchItem.h"

@implementation SearchItemBase

- (void) findPropertiesWithDataSource:(PropertyDataSource *)propertyDataSource
                           pageNumber:(NSUInteger*)page
                               result:(PropertyDataSourceResultSuccess)successResult
                                error:(PropertyDataSourceResultError)errorResult
{
    // abstract method!
    @throw [NSException exceptionWithName:NSInternalInconsistencyException
                                   reason:[NSString stringWithFormat:@"You must override %@ in a subclass", NSStringFromSelector(_cmd)]
                                 userInfo:nil];
}

- (void)toRecentSearchDataEntity:(RecentSearchDataEntity *)entity
{
    // abstract method!
    @throw [NSException exceptionWithName:NSInternalInconsistencyException
                                   reason:[NSString stringWithFormat:@"You must override %@ in a subclass", NSStringFromSelector(_cmd)]
                                 userInfo:nil];
}

+ (id)fromRecentSearchDataEntity:(RecentSearchDataEntity *)entity
{
    if ([entity.isLocationSearch boolValue])
    {
        GeolocationSearchItem* item = [[GeolocationSearchItem alloc] init];
        item.latitude = [entity.latitude doubleValue];
        item.longitude = [entity.longitude doubleValue];
        item.displayText = entity.displayString;
        item.matches = [entity.matches unsignedIntegerValue];
        return item;
    }
    else
    {
        PlainTextSearchItem* item = [[PlainTextSearchItem alloc] init];
        item.displayText = entity.displayString;
        item.searchText = entity.searchString;
        item.matches = [entity.matches unsignedIntegerValue];
        return item;
    }
}

@end
