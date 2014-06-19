//
//  SearchResultsTableViewController.m
//  propertycross
//
//  Created by Matthew Dunsdon on 17/06/2014.
//  Copyright (c) 2014 TasteJS. All rights reserved.
//

#import "SearchResultsTableViewController.h"
#import "PropertyDetailsViewController.h"
#import "UITableViewCell+ImageHelpers.h"

@interface SearchResultsTableViewController ()

@end

@implementation SearchResultsTableViewController
{
    NSArray* _properties;
    PropertyListingResult* _result;
    PropertyDataSource* _datasource;
    int _pageNumber;
    SearchItemBase* _searchItem;
    BOOL _isLoading;
    Property* _selectedProperty;
    UIImage* _homeImage;
}

-(void)viewDidLoad
{
    [super viewDidLoad];

    _homeImage = [UIImage imageNamed:@"Home.png"];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)setSearchResults:(PropertyListingResult *)result
      datasource:(PropertyDataSource *)datasource
      searchItem:(SearchItemBase *)searchItem
{
    _pageNumber = 1;
    _searchItem = searchItem;
    _datasource = datasource;
    _result = result;
    _properties = result.properties;
    self.title = [NSString stringWithFormat:@"%d of %@ results", _properties.count, _result.totalResults];
    [self.tableView reloadData];
}

#pragma mark - Table view data source

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    BOOL loadMoreVisible = _properties.count < [_result.totalResults integerValue];
    
    return _properties.count + (loadMoreVisible ? 1 : 0);
}

// produceLoadMoreDescriptionWithTitle:withCount:withTotal
- (NSMutableAttributedString *)produceLoadMoreDescriptionWithTitle:(NSString *)title withCount:(NSNumber *)count withTotal:(NSNumber *)total
{
    // Create the attributes
    UIFont *boldFont = [UIFont boldSystemFontOfSize:13.0f];
    UIFont *regularFont = [UIFont systemFontOfSize:13.0f];

    NSDictionary *regularFontAttributes = @{ NSFontAttributeName : regularFont};
    NSDictionary *boldFontAttributes = @{ NSFontAttributeName : boldFont};
    
    NSString* countText =[NSString stringWithFormat:@"%@", count];
    NSString* totalText =[NSString stringWithFormat:@"%@", total];

    // Create the attributed string
    NSString* plainText = [NSString stringWithFormat:@"Results for %@, showing %@ of %@ properties",
                      _searchItem.displayText, countText, totalText];
    NSMutableAttributedString *attributedText = [[NSMutableAttributedString alloc] initWithString:plainText
                                                                                       attributes:regularFontAttributes];
    
    // make certain components bold
    [attributedText setAttributes:boldFontAttributes
                            range:NSMakeRange(12, title.length)];
    [attributedText setAttributes:boldFontAttributes
                            range:NSMakeRange(12 + title.length + 10, countText.length)];
    [attributedText setAttributes:boldFontAttributes
                            range:NSMakeRange(12 + title.length + 10 + countText.length + 4, totalText.length)];
    return attributedText;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell* cell;
    
    if (indexPath.row < _properties.count)
    {
        cell = (UITableViewCell*)[tableView dequeueReusableCellWithIdentifier:@"PropertyCell"];

        // render a property
        Property* property = _properties[indexPath.row];

        cell.textLabel.text = property.formattedPrice;
        cell.detailTextLabel.text = property.title;
        [cell loadImageFromURLInBackground:property.thumbnailUrl
                     withDefaultImageOrNil:_homeImage];
    }
    else
    {
        cell = (UITableViewCell*)[tableView dequeueReusableCellWithIdentifier:@"LoadMoreCell"];

        // render a load more indicator
        cell.textLabel.text = _isLoading ? @"Loading ..." : @"Load more ...";
        
        cell.detailTextLabel.attributedText = [self produceLoadMoreDescriptionWithTitle:_searchItem.displayText
                                                                              withCount:[NSNumber numberWithUnsignedInteger:_properties.count]
                                                                              withTotal:_result.totalResults];
    }

    return cell;
}

- (void)loadMore
{
    // load more clicked
    _pageNumber++;
    _isLoading = YES;
    
    // reload the label to update the 'loading' indicator. This could potentially be optimized.
    [self.tableView reloadData];
    
    PropertyDataSourceResultSuccess success = ^(PropertyDataSourceResult *result){
        _isLoading = NO;
        
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
            [self.tableView reloadData];
        }
    };
    
    [_searchItem findPropertiesWithDataSource:_datasource
                                   pageNumber:[NSNumber numberWithInt:_pageNumber]
                                       result:success
                                        error:nil];
}

#pragma mark - UITableViewDelegate implementation

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (indexPath.row < _properties.count)
    {
        [tableView deselectRowAtIndexPath:indexPath animated:NO];
        
        // property clicked
        _selectedProperty = _properties[indexPath.row];
        [self performSegueWithIdentifier:@"SearchDetails" sender:self];
    }
    else
    {
        [self loadMore];
    }
}


#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Pass the selected object to the new view controller.
    if ([[segue identifier] isEqualToString:@"SearchDetails"])
    {
        PropertyDetailsViewController* propertyDetailsViewController = [segue destinationViewController];
        
        [propertyDetailsViewController setProperty:_selectedProperty];
    }
}


@end
