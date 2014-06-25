//
//  PropertyDetailsViewController.h
//  propertycross
//
//  Created by Matthew Dunsdon on 17/06/2014.
//  Copyright (c) 2014 TasteJS. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Property.h"

@interface PropertyDetailsViewController : UIViewController

- (void)setProperty:(Property*) property;

@property (weak, nonatomic) IBOutlet UILabel *priceLabel;
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;
@property (weak, nonatomic) IBOutlet UIImageView *image;
@property (weak, nonatomic) IBOutlet UILabel *bedBathroomLabel;
@property (weak, nonatomic) IBOutlet UILabel *summaryLabel;
@property (weak, nonatomic) IBOutlet UIBarButtonItem *favouriteButton;
- (IBAction)toggleFavourite:(id)sender;


@end
