//
//  GeolocationSearchItem.m
//  Property Finder
//
//  Created by Colin Eberhardt on 24/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "GeolocationSearchItem.h"

@implementation GeolocationSearchItem

+ (id)geolocationSearchItemFromLocation:(CLLocationCoordinate2D)location
{
    GeolocationSearchItem* item = [[GeolocationSearchItem alloc] init];
    item.latitude = location.latitude;
    item.longitude = location.longitude;
    item.displayText = [NSString stringWithFormat:@"%.2f, %.2f", location.latitude, location.longitude];
    return item;
}

- (void)toRecentSearchDataEntity:(RecentSearchDataEntity *)entity
{
    entity.latitude = [NSNumber numberWithDouble:self.latitude];
    entity.longitude = [NSNumber numberWithDouble:self.longitude];
    entity.displayString = self.displayText;
    entity.isLocationSearch = [NSNumber numberWithBool:YES];
    entity.matches = self.matches;
}

- (void)findPropertiesWithDataSource:(PropertyDataSource *)propertyDataSource
                          pageNumber:(NSNumber *)page
                              result:(PropertyDataSourceResultSuccess)successResult
                               error:(PropertyDataSourceResultError)errorResult
{
    PropertyDataSourceResultSuccess successBlock = ^(PropertyDataSourceResult *result){
        successResult(result);
    };
    [propertyDataSource findPropertiesForLatitude:self.latitude
                                        longitude:self.longitude
                                       pageNumber:page
                                          success:successBlock
                                            error:errorResult];
}

@end
