//
//  PropertyLocationsResult.m
//  PropertyCross
//
//  Created by Colin Eberhardt on 17/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "PropertyLocationsResult.h"
#import "Location.h"

@implementation PropertyLocationsResult

+ (id)properertyLocationsResultFromJSON:(NSDictionary *)jsonData
{
    PropertyLocationsResult* result = [[PropertyLocationsResult alloc] init];
    
    NSArray* locations = (NSArray*)[jsonData objectForKey:@"locations"];
    NSMutableArray* locationObjects = [[NSMutableArray alloc] init];
    for (NSDictionary* location in locations)
    {
        [locationObjects addObject:[Location locationFromJSONData:location]];
    }
    result.locations = [NSArray arrayWithArray:locationObjects];
    
    return result;
}

@end
