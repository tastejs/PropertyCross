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
    PropertyDataSource* _datasource;
    int _pageNumber;
    SearchItemBase* _searchItem;
}

#pragma mark - initialisation code

- (id) initWithResults:(PropertyListingResult *)result
            datasource:(PropertyDataSource *)datsource
            searchItem:(SearchItemBase *)searchItem
{
    self = [self initWithNibName:@"SearchResultsViewController"
                          bundle:nil];
    if (self)
    {
        _pageNumber = 1;
        _searchItem = searchItem;
        _datasource = datsource;
        _result = result;
        _properties = result.properties;
        self.title = [NSString stringWithFormat:@"%d of %@ results", _properties.count, _result.totalResults];
        [self.searchResultsTable reloadData];
    }
    return self;
}

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
    
    self.navigationItem.backBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"Results"
                                                                             style:UIBarButtonItemStyleBordered
                                                                            target:self
                                                                            action:nil];
    
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
    
    if (indexPath.row < _properties.count)
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
                                     _properties.count, _result.totalResults];
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
    BOOL loadMoreVisible = _properties.count < [_result.totalResults integerValue];
    
    return _properties.count + (loadMoreVisible ? 1 : 0);
}

#pragma mark - UITableViewDelegate implementation

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (indexPath.row < _properties.count)
    {
        [tableView deselectRowAtIndexPath:indexPath animated:NO];
        
        // property clicked
        Property* property = _properties[indexPath.row];
        PropertyViewController* controller = [[PropertyViewController alloc] initWithProperty:property];
        
        [self.navigationController pushViewController:controller
                                             animated:YES];
    }
    else
    {
        // load more clicked
        _pageNumber++;
        
        PropertyDataSourceResultSuccess success = ^(PropertyDataSourceResult *result){
            
            // determine the type of returned result
            if ([result isKindOfClass:[PropertyListingResult class]])
            {
                PropertyListingResult* listingResult = (PropertyListingResult*)result;
                
                // add the additional properties
                NSMutableArray* mutableProperties = [NSMutableArray arrayWithArray:_properties];
                [mutableProperties addObjectsFromArray:listingResult.properties];
                _properties = [NSArray arrayWithArray:mutableProperties];
                
                // render the new results
                self.title = [NSString stringWithFormat:@"%d of %@ results", _properties.count, _result.totalResults];
                [self.searchResultsTable reloadData];
            }
        };
        
        [_searchItem findPropertiesWithDataSource:_datasource
                                       pageNumber:[NSNumber numberWithInt:_pageNumber]
                                           result:success];
    }
}

@end
