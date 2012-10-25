//
//  RecentSearchesTableViewSource.m
//  Property Finder
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
    UITableViewCell* cell = (UITableViewCell*)[tableView dequeueReusableCellWithIdentifier:@"cell"];
    if (!cell)
    {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault
                                      reuseIdentifier:@"cell"];
    }
    
    RecentSearchDataEntity* recentSearch = (RecentSearchDataEntity*)self.items[indexPath.row];
    cell.textLabel.text = recentSearch.displayString;
    
    return cell;
}

- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section
{
    return @"Recent searches:";
}
@end
