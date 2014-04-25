//
//  Location.h
//  PropertyCross
//
//  Created by Colin Eberhardt on 17/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>

// represents a location which can be used to un-ambiguous query the property database.
@interface Location : NSObject

@property NSString* displayName;

@property NSString* name;

+ (id) locationFromJSONData:(NSDictionary*) jsonData;

@end
