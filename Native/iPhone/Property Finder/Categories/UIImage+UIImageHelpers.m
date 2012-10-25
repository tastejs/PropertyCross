//
//  UIImage+UIImageHelpers.m
//  Property Finder
//
//  Created by Colin Eberhardt on 17/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "UIImage+UIImageHelpers.h"

@implementation UIImage (UIImageHelpers)

+ (id)imageWithURLString:(NSString*) url
{
    return [UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:url]]];
    //return nil;
}

@end
