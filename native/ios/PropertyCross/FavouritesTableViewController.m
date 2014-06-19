//
//  FavouritesTableViewController.m
//  propertycross
//
//  Created by Matthew Dunsdon on 17/06/2014.
//  Copyright (c) 2014 TasteJS. All rights reserved.
//

#import "FavouritesTableViewController.h"
#import "PropertyDetailsViewController.h"
#import "UITableViewCell+ImageHelpers.h"
#import "PersistentDataStore.h"
#import "AppDelegate.h"
#import "FavouritePropertyDataEntity.h"

@interface FavouritesTableViewController ()

@end

@implementation FavouritesTableViewController
{
    NSArray* _properties;
    Property* _selectedProperty;
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    _properties = appDelegate.persistentDataStore.favourites;

    [self.tableView reloadData];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - Table view data source

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return _properties.count;
}


- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell* cell = (UITableViewCell*)[tableView dequeueReusableCellWithIdentifier:@"cell"];
    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleSubtitle
                                      reuseIdentifier:@"cell"];
    }
    
    FavouritePropertyDataEntity* propertyEntity = _properties[indexPath.row];
    Property* property = [Property propertyFromFavouritePropertyDataEntity:propertyEntity];
    cell.textLabel.text = property.formattedPrice;
    cell.detailTextLabel.text = property.title;
    [cell loadImageFromURLInBackground:property.thumbnailUrl];
    cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
    
    return cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 70.0f;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    FavouritePropertyDataEntity* property = _properties[indexPath.row];
    _selectedProperty = [Property propertyFromFavouritePropertyDataEntity:property];
    
    [self performSegueWithIdentifier:@"FavouriteDetails" sender:self];
}


#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Pass the selected object to the new view controller.
    if ([[segue identifier] isEqualToString:@"FavouriteDetails"])
    {
        PropertyDetailsViewController* propertyDetailsViewController = [segue destinationViewController];
        
        [propertyDetailsViewController setProperty:_selectedProperty];
    }
}

@end
