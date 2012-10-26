//
//  NSDictionary+DictionaryJSONHelpers.h
//  Property Finder
//
//  Created by Colin Eberhardt on 17/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>

// mehods that make it easier to extract JSON values
@interface NSDictionary (DictionaryJSONHelpers)

- (NSNumber*) NSNumberForKey:(NSString*)key;

- (NSString*) NSStringForKey:(NSString*)key;

@end
