//
//  PropertyViewController.h
//  Property Finder
//
//  Created by Colin Eberhardt on 16/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Property.h"

@interface PropertyViewController : UIViewController

- (void) setProperty:(Property*) property;

@property (weak, nonatomic) IBOutlet UILabel *priceLabel;
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;
@property (weak, nonatomic) IBOutlet UIImageView *image;
@property (weak, nonatomic) IBOutlet UILabel *bedBathroomLabel;
@property (weak, nonatomic) IBOutlet UILabel *summaryLabel;

@end
