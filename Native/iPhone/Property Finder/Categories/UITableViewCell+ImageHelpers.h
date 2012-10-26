//
//  UITableViewCell+ImageHelpers.h
//  Property Finder
//
//  Created by Colin Eberhardt on 24/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UITableViewCell (ImageHelpers)

// sets the imageView.image property to a UIImage which renders the image from the given URL. This is
// performed on a background thread in order to free the UI thread to give smooth scrolling.
- (void) loadImageFromURLInBackground: (NSString*) imageURL;

@end
