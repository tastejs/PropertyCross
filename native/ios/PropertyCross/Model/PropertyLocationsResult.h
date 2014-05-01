//
//  PropertyLocationsResult.h
//  PropertyCross
//
//  Created by Colin Eberhardt on 17/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PropertyDataSourceResult.h"

// a list of locations, returned as the result of a property search which was ambiguous.
@interface PropertyLocationsResult : PropertyDataSourceResult

@property NSArray* locations;

+ (id) properertyLocationsResultFromJSON: (NSDictionary*) jsonData;

@end
