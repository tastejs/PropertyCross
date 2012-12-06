
//
//  LocationsTableViewSource.m
//  Property Finder
//
//  Created by Colin Eberhardt on 18/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "LocationsTableViewSource.h"

@implementation LocationsTableViewSource

+ (id)locationsTableViewSourceFromArray:(NSArray *)locations
{
    LocationsTableViewSource* source = [[LocationsTableViewSource alloc] init];
    source.items = locations;
    return source;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell* cell = (UITableViewCell*)[tableView dequeueReusableCellWithIdentifier:@"cell"];
    if (!cell)
    {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault
                                      reuseIdentifier:@"cell"];
    }
    
    Location* location = (Location*)self.items[indexPath.row];
    cell.textLabel.text = location.displayName;
    
    return cell;
}

- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section
{
    return @"Select a location below:";
}

@end
