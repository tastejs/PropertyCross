//
//  RecentSearchesTableViewSource.m
//  PropertyCross
//
//  Created by Colin Eberhardt on 18/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "RecentSearchesTableViewSource.h"
#import "RecentSearchDataEntity.h"

@implementation RecentSearchesTableViewSource

+ (id)recentSearchesTableViewSourceFromArray:(NSArray *)recentSearches
{
    RecentSearchesTableViewSource* source = [[RecentSearchesTableViewSource alloc] init];
    source.items = recentSearches;
    return source;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell* cell = (UITableViewCell*)[tableView dequeueReusableCellWithIdentifier:@"SearchResultsCell"];

    RecentSearchDataEntity* recentSearch = (RecentSearchDataEntity*)self.items[indexPath.row];
    
    cell.textLabel.text = recentSearch.displayString;
    cell.detailTextLabel.text = [recentSearch.matches stringValue];
    
    return cell;
}

- (UIView*)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section
{
    return (UITableViewCell*)[tableView dequeueReusableCellWithIdentifier:@"RecentSearchesHeaderCell"];
}
@end
