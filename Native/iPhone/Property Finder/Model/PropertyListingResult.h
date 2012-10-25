//
//  PropertyListingResult.h
//  Property Finder
//
//  Created by Colin Eberhardt on 11/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "PropertyDataSourceResult.h"

@interface PropertyListingResult : PropertyDataSourceResult

@property NSNumber* totalResults;

@property NSNumber* pageNumber;

@property NSNumber* totalPages;

@property NSArray* properties;

+ (id)propertyListingResultFromJSON: (NSDictionary*) jsonData;

@end
