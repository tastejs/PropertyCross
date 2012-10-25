//
//  JSONDataSourceProtocol.h
//  Property Finder
//
//  Created by Colin Eberhardt on 17/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef void(^JSONDataSourceSuccess)(NSString* result);

@protocol JSONDataSourceProtocol <NSObject>

-(void)findPropertiesForSearchString: (NSString*) searchString
                             success: (JSONDataSourceSuccess) successResult;

-(void)findPropertiesForLatitude: (double) latitude
                       longitude: (double) longitude
                         success: (JSONDataSourceSuccess) successResult;

@end
