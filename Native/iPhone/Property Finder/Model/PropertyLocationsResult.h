//
//  PropertyLocationsResult.h
//  Property Finder
//
//  Created by Colin Eberhardt on 17/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PropertyDataSourceResult.h"

@interface PropertyLocationsResult : PropertyDataSourceResult

@property NSArray* locations;

+ (id) properertyLocationsResultFromJSON: (NSDictionary*) jsonData;

@end
