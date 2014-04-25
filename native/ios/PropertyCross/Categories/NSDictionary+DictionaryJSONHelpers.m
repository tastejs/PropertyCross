//
//  NSDictionary+DictionaryJSONHelpers.m
//  PropertyCross
//
//  Created by Colin Eberhardt on 17/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "NSDictionary+DictionaryJSONHelpers.h"

@implementation NSDictionary (DictionaryJSONHelpers)

- (NSNumber*) NSNumberForKey:(NSString*)key
{
    NSString* value = (NSString*)[self objectForKey:key];    
    if (value)
    {
        return [NSNumber numberWithInt:[value integerValue]];
    }
    else
    {
        return nil;
    }
}

- (NSString*) NSStringForKey:(NSString*)key
{
    return (NSString*)[self objectForKey:key];
}

@end
