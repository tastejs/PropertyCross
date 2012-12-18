//
//  PropertyListingResult.h
//  Property Finder
//
//  Created by Colin Eberhardt on 11/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "PropertyDataSourceResult.h"

// a collection of property listings returned as the result of a successful query of
// the property database.
@interface PropertyListingResult : PropertyDataSourceResult

@property NSNumber* totalResults;

@property NSNumber* pageNumber;

@property NSNumber* totalPages;

@property NSArray* properties;

+ (id)propertyListingResultFromJSON: (NSDictionary*) jsonData;

@end
