//
//  PropertyDetailsViewController.m
//  propertycross
//
//  Created by Matthew Dunsdon on 17/06/2014.
//  Copyright (c) 2014 TasteJS. All rights reserved.
//

#import "PropertyDetailsViewController.h"
#import "AppDelegate.h"
#import "PersistentDataStore.h"
#import "UIImage+UIImageHelpers.h"

@interface PropertyDetailsViewController ()

@end

@implementation PropertyDetailsViewController
{
    Property* _property;
    PersistentDataStore* _dataStore;
    UIImage* _starImage;
    UIImage* _noStarImage;
}

- (void)setProperty:(Property*) property
{
    _property = property;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    _starImage = [UIImage imageNamed:@"star.png"];
    _noStarImage = [UIImage imageNamed:@"nostar.png"];
    
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    _dataStore = appDelegate.persistentDataStore;
    
    self.priceLabel.text = _property.formattedPrice;
    self.titleLabel.text = _property.shortTitle;
    self.bedBathroomLabel.text = _property.bedBathroomText;
    self.image.image = [UIImage imageWithURLString:_property.imageUrl];
    
    self.summaryLabel.text = _property.summary;
    [self.summaryLabel sizeToFit];

    [self updateFavouriteButtonUI];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - Property Detail actions

-(void)updateFavouriteButtonUI
{
    [self.favouriteButton setImage:([_dataStore isPropertyFavourited:_property] ? _starImage : _noStarImage)];
}

- (IBAction)toggleFavourite:(id)sender
{
    [_dataStore toggleFavourite:_property];
    
    [self updateFavouriteButtonUI];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
