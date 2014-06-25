
//
//  LocationsTableViewSource.m
//  PropertyCross
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
    UITableViewCell* cell = (UITableViewCell*)[tableView dequeueReusableCellWithIdentifier:@"LocationCell"];
    
    Location* location = (Location*)self.items[indexPath.row];
    cell.textLabel.text = location.displayName;
    
    return cell;
}

- (UIView*)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section
{
    return (UITableViewCell*)[tableView dequeueReusableCellWithIdentifier:@"LocationHeaderCell"];
}

@end
