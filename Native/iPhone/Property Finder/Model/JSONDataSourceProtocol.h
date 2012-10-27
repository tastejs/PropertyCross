//
//  JSONDataSourceProtocol.h
//  Property Finder
//
//  Created by Colin Eberhardt on 17/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef void(^JSONDataSourceSuccess)(NSString* result);

// a protocol which provides methods for querying a property database with the results
// returned in JSON string format
@protocol JSONDataSourceProtocol <NSObject>

// finds properties which match the given plain-text string
-(void)findPropertiesForSearchString: (NSString*) searchString
                          pageNumber: (NSNumber*) page
                             success: (JSONDataSourceSuccess) successResult;

// find properties at the given geolocation
-(void)findPropertiesForLatitude: (double) latitude
                       longitude: (double) longitude
                      pageNumber: (NSNumber*) page
                         success: (JSONDataSourceSuccess) successResult;

@end
