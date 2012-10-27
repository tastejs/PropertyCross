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

#pragma mark - initialisation code

- (id) initWithResults:(PropertyListingResult *)result
{
    self = [self initWithNibName:@"SearchResultsViewController"
                          bundle:nil];
    if (self)
    {
        _result = result;
        _properties = result.properties;
        [self.searchResultsTable reloadData];
    }
    return self;
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

#pragma mark - UITableViewDataSource implementation

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell* cell = (UITableViewCell*)[tableView dequeueReusableCellWithIdentifier:@"cell"];
    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleSubtitle
                                      reuseIdentifier:@"cell"];
    }
    
    if (indexPath.row < _result.properties.count)
    {
        // render a property
        Property* property = _properties[indexPath.row];
        cell.textLabel.text = property.formattedPrice;
        cell.detailTextLabel.text = property.title;
        [cell loadImageFromURLInBackground:property.thumbnailUrl];
        cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
    }
    else
    {
        // render a load more indicator
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

#pragma mark - UITableViewDelegate implementation

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (indexPath.row < _result.properties.count)
    {
        // property clicked
        Property* property = _properties[indexPath.row];
        PropertyViewController* controller = [[PropertyViewController alloc] initWithProperty:property];
        
        [self.navigationController pushViewController:controller
                                             animated:YES];
    }
    else
    {
        // load more clicked
        
    }
}

@end
