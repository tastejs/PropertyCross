//
//  PropertyListingResult.m
//  PropertyCross
//
//  Created by Colin Eberhardt on 11/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "PropertyListingResult.h"
#import "NSDictionary+DictionaryJSONHelpers.h"
#import "Property.h"

@implementation PropertyListingResult

+ (id)propertyListingResultFromJSON:(NSDictionary *)jsonData
{
    PropertyListingResult* result = [[PropertyListingResult alloc] init];
    
    result.totalPages = [[jsonData NSNumberForKey:@"total_pages"] unsignedIntegerValue];
    result.pageNumber = [[jsonData NSNumberForKey:@"page"] unsignedIntegerValue];
    result.totalResults = [[jsonData NSNumberForKey:@"total_results"] unsignedIntegerValue];
    
    NSArray* listings = (NSArray*)[jsonData objectForKey:@"listings"];
    NSMutableArray* properties = [[NSMutableArray alloc] init];
    for (NSDictionary* listing in listings)
    {
        [properties addObject:[Property propertyFromJSONData:listing]];
    }    
    result.properties = [NSArray arrayWithArray:properties];
    
    return result;
}

@end
