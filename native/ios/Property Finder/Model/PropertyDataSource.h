//
//  PropertyDataSource.h
//  Property Finder
//
//  Created by Colin Eberhardt on 11/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "JSONDataSourceProtocol.h"
#import "PropertyDataSourceResult.h"

typedef void(^PropertyDataSourceResultSuccess)(PropertyDataSourceResult* result);

// Provides methods for querying a property database with the results
// returned in the form of 'model' objects.
@interface PropertyDataSource : NSObject

- (id)initWithDataSource:(id<JSONDataSourceProtocol>)dataSource;

// TODO - add timeout / error

// finds properties which match the given plain-text string
-(void)findPropertiesForSearchString: (NSString*) searchString
                          pageNumber:(NSNumber *)page
                             success: (PropertyDataSourceResultSuccess) successResult;

// finds properties which match the given geolocation
-(void)findPropertiesForLatitude: (double) latitude
                       longitude: (double) longitude
                      pageNumber:(NSNumber *)page
                         success: (PropertyDataSourceResultSuccess) successResult;

@end
