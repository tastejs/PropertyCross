//
//  SearchResultsViewController.m
//  Property Finder
//
//  Created by Colin Eberhardt on 12/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "SearchResultsViewController.h"
#import "Property.h"
#import "PropertyViewController.h"
#import "UITableViewCell+ImageHelpers.h"

@interface SearchResultsViewController ()

@end

@implementation SearchResultsViewController
{
    NSArray* _properties;
    PropertyListingResult* _result;
}


- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self)
    {
        self.title = @"Resuls";
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
    
    self.searchResultsTable.dataSource = self;
    self.searchResultsTable.delegate = self;
    
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}


- (void)setResult:(PropertyListingResult*)result
{
    _result = result;
    _properties = result.properties;
    [self.searchResultsTable reloadData];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell* cell = (UITableViewCell*)[tableView dequeueReusableCellWithIdentifier:@"cell"];
    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleSubtitle
                                      reuseIdentifier:@"cell"];
    }
    
    if (indexPath.row < _result.properties.count)
    {
        Property* property = _properties[indexPath.row];
        cell.textLabel.text = property.title;
        cell.detailTextLabel.text = property.formattedPrice;
        [cell loadImageFromURLInBackground:property.thumbnailUrl];
        cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
    }
    else
    {
        cell.textLabel.text = @"Load more ...";
        cell.detailTextLabel.Text = [NSString stringWithFormat:@"Showing %d of %@ matches",
                                     _result.properties.count, _result.totalResults];
        cell.imageView.image = nil;
    }
    
    return  cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 70.0f;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    BOOL loadMoreVisible = _result.properties.count < [_result.totalResults integerValue];
    
    return _properties.count + (loadMoreVisible ? 1 : 0);
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    PropertyViewController* controller = [[PropertyViewController alloc] initWithNibName:@"PropertyViewController" bundle:nil];
    
    if (indexPath.row < _result.properties.count)
    {
        Property* property = _properties[indexPath.row];
        [controller setProperty:property];
        
        [self.navigationController pushViewController:controller
                                             animated:YES];
    }
}

@end
