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
}

#pragma mark - initialisation

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self)
    {
        self.title = @"Property";
        
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
    
    NSString* buttonText = [_dataStore isPropertyFavourited:_property] ? @"-" : @"+";
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:buttonText
                                                                              style:UIBarButtonItemStyleBordered
                                                                             target:self
                                                                             action:@selector(favouriteButtonTouched)];
    
}

- (void) favouriteButtonTouched
{
    [_dataStore toggleFavourite:_property];
    NSString* buttonText = [_dataStore isPropertyFavourited:_property] ? @"-" : @"+";
    self.navigationItem.rightBarButtonItem.title = buttonText;
}

- (void)setProperty:(Property *)property
{
    _property = property;
}

@end

