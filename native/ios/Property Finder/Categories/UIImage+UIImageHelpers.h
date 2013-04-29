//
//  UIImage+UIImageHelpers.h
//  Property Finder
//
//  Created by Colin Eberhardt on 17/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIImage (UIImageHelpers)

// creates a UIImage which displays the image from the given URL.
+ (id)imageWithURLString:(NSString*) url;

@end
