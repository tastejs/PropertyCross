//
//  Location.m
//  PropertyCross
//
//  Created by Colin Eberhardt on 17/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "Location.h"
#import "NSDictionary+DictionaryJSONHelpers.h"

@implementation Location

+ (id)locationFromJSONData:(NSDictionary *)jsonData
{
    Location* location = [[Location alloc] init];
    
    location.displayName = [jsonData NSStringForKey:@"long_title"];
    location.name = [jsonData NSStringForKey:@"place_name"];
    
    return location;
}

@end
