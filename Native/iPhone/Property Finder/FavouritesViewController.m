//
//  FavouritesViewController.m
//  Property Finder
//
//  Created by Colin Eberhardt on 24/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "FavouritesViewController.h"
#import "Property.h"
#import "PropertyViewController.h"
#import "UITableViewCell+ImageHelpers.h"
#import "PersistentDataStore.h"
#import "AppDelegate.h"
#import "FavouritePropertyDataEntity.h"

@interface FavouritesViewController ()

@end

@implementation FavouritesViewController
{
    NSArray* _properties;
}

#pragma mark - initialisation

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
         self.title = @"Favourites";
        
        AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
        _properties = appDelegate.persistentDataStore.favourites;
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.tableView.dataSource = self;
    self.tableView.delegate = self;
}

#pragma mark - UITableViewDataSource implementation

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell* cell = (UITableViewCell*)[tableView dequeueReusableCellWithIdentifier:@"cell"];
    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleSubtitle
                                      reuseIdentifier:@"cell"];
    }
    
    FavouritePropertyDataEntity* propertyEntity = _properties[indexPath.row];
    Property* property = [Property propertyFromFavouritePropertyDataEntity:propertyEntity];
    cell.textLabel.text = property.title;
    cell.detailTextLabel.text = property.formattedPrice;
    [cell loadImageFromURLInBackground:property.thumbnailUrl];
    cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
    
    return  cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 70.0f;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return _properties.count;
}

#pragma mark - UITableViewDelegate implementation

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    PropertyViewController* controller = [[PropertyViewController alloc] initWithNibName:@"PropertyViewController" bundle:nil];
    
    FavouritePropertyDataEntity* property = _properties[indexPath.row];
    Property* prop = [Property propertyFromFavouritePropertyDataEntity:property];
    [controller setProperty:prop];
    
    [self.navigationController pushViewController:controller
                                         animated:YES];
}


@end
