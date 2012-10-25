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

@interface PropertyDataSource : NSObject

- (id)initWithDataSource:(id<JSONDataSourceProtocol>)dataSource;

// TODO - add timeout / error
-(void)findPropertiesForSearchString: (NSString*) searchString
                        success: (PropertyDataSourceResultSuccess) successResult;

-(void)findPropertiesForLatitude: (double) latitude
                       longitude: (double) longitude
                         success: (PropertyDataSourceResultSuccess) successResult;

@end
