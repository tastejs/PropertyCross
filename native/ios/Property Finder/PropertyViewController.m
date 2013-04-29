//
//  PropertyViewController.m
//  Property Finder
//
//  Created by Colin Eberhardt on 16/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "PropertyViewController.h"
#import "UIImage+UIImageHelpers.h"
#import "PersistentDataStore.h"
#import "AppDelegate.h"

@interface PropertyViewController ()

@end

@implementation PropertyViewController
{
    Property* _property;
    PersistentDataStore* _dataStore;
    UIImage* _starImage;
    UIImage* _noStarImage;
}

#pragma mark - initialisation

- (id)initWithProperty:(Property *)property
{
    self = [self initWithNibName:@"PropertyViewController" bundle:nil];
    if (self)
    {
        _property = property;
    }
    return self;
}

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self)
    {
        self.title = @"Property Details";
        
        _starImage = [UIImage imageNamed:@"star.png"];
        _noStarImage = [UIImage imageNamed:@"nostar.png"];
        
        AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
        _dataStore = appDelegate.persistentDataStore;
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.priceLabel.text = _property.formattedPrice;
    self.titleLabel.text = _property.shortTitle;
    self.bedBathroomLabel.text = _property.bedBathroomText;
    self.image.image = [UIImage imageWithURLString:_property.imageUrl];
    
    self.summaryLabel.text = _property.summary;
    [self.summaryLabel sizeToFit];
    
    UIImage* buttonImage = [_dataStore isPropertyFavourited:_property] ? _starImage : _noStarImage;
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithImage:buttonImage
                                                                              style:UIBarButtonItemStyleBordered
                                                                             target:self
                                                                             action:@selector(favouriteButtonTouched)];
    
}

- (void) favouriteButtonTouched
{
    [_dataStore toggleFavourite:_property];
    UIImage* buttonImage = [_dataStore isPropertyFavourited:_property] ? _starImage : _noStarImage;
    self.navigationItem.rightBarButtonItem.image = buttonImage;
}

@end

