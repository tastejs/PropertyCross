//
//  PlainTextSearchItem.m
//  Property Finder
//
//  Created by Colin Eberhardt on 24/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "PlainTextSearchItem.h"

@implementation PlainTextSearchItem

+ (id) plainTextSearchItemFromString:(NSString *)searchTerm
{
    NSString* trimmedSearchString = [searchTerm stringByTrimmingCharactersInSet:
                                     [NSCharacterSet whitespaceCharacterSet]];
    
    PlainTextSearchItem* item = [[PlainTextSearchItem alloc] init];
    item.displayText = trimmedSearchString;
    item.searchText = trimmedSearchString;
    return item;
}

+ (id) plainTextSearchItemFromLocation:(Location *)location
{
    PlainTextSearchItem* item = [[PlainTextSearchItem alloc] init];
    item.displayText = location.displayName;
    item.searchText = location.name;
    return item;
}

- (void) findPropertiesWithDataSource:(PropertyDataSource *)propertyDataSource
                           pageNumber:(NSNumber *)page
                               result:(PropertyDataSourceResultSuccess)successResult
                                error:(PropertyDataSourceResultError)errorResult
{
    PropertyDataSourceResultSuccess successBlock = ^(PropertyDataSourceResult *result){
        successResult(result);
    };
    [propertyDataSource findPropertiesForSearchString:self.searchText
                                           pageNumber:page
                                              success:successBlock
                                                error:errorResult];
}

- (void)toRecentSearchDataEntity:(RecentSearchDataEntity *)entity
{
    entity.searchString = self.searchText;
    entity.displayString = self.displayText;
    entity.timestamp = [NSDate date];
    entity.isLocationSearch = [NSNumber numberWithBool:NO];
    entity.matches = self.matches;
}

@end
