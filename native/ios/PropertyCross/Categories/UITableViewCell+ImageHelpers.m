//
//  UITableViewCell+ImageHelpers.m
//  PropertyCross
//
//  Created by Colin Eberhardt on 24/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "UITableViewCell+ImageHelpers.h"

@implementation UITableViewCell (ImageHelpers)

- (void) loadImageFromURLInBackground:(NSString *)imageURL
{
    self.imageView.frame = CGRectMake(self.imageView.frame.origin.x, self.imageView.frame.origin.y, 60, 60);
    
    dispatch_queue_t downloadQueue = dispatch_queue_create("image downloader", NULL);
    dispatch_async(downloadQueue, ^{
        NSData *data = [NSData dataWithContentsOfURL:[NSURL URLWithString:imageURL]];
        UIImage * image = [UIImage imageWithData:data];
        
        dispatch_async(dispatch_get_main_queue(), ^{
            self.imageView.image = image;
            [self setNeedsLayout];
        });
    });
}

@end
