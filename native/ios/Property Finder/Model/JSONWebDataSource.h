//
//  JSONWebDataSource.h
//  Property Finder
//
//  Created by Colin Eberhardt on 16/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "JSONDataSourceProtocol.h"

// adopts the JSONDataSourceProtocol protocol with the JSON results being supplied
// by the Nestoria search API.
@interface JSONWebDataSource : NSObject <JSONDataSourceProtocol>

@end
