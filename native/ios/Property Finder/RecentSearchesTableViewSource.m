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
    UITableViewCell* cell = (UITableViewCell*)[tableView dequeueReusableCellWithIdentifier:@"recentSearchCell"];
    if (!cell)
    {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault
                                      reuseIdentifier:@"recentSearchCell"];
    }
    
    RecentSearchDataEntity* recentSearch = (RecentSearchDataEntity*)self.items[indexPath.row];
    cell.textLabel.text = recentSearch.displayString;
    
    // add an extra label to the cell in order to display the number of matches
    UILabel* leftHandLabel = (UILabel*)[cell viewWithTag:10];
    if (leftHandLabel == nil)
    {
        leftHandLabel = [[UILabel alloc] initWithFrame:CGRectMake(cell.frame.size.width - 100, 0, 80, cell.frame.size.height)];
        leftHandLabel.backgroundColor = [UIColor clearColor];
        leftHandLabel.textAlignment = NSTextAlignmentRight;
        leftHandLabel.tag = 10;
        [cell addSubview:leftHandLabel];
    }
    
    leftHandLabel.text = [recentSearch.matches stringValue];
    
    return cell;
}

- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section
{
    return @"Recent searches:";
}
@end
