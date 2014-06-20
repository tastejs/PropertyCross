//
//  PropertySearchViewController.m
//  propertycross
//
//  Created by Matthew Dunsdon on 17/06/2014.
//  Copyright (c) 2014 TasteJS. All rights reserved.
//

#import "PropertySearchViewController.h"
#import "SearchResultsTableViewController.h"
#import "PropertyDataSource.h"
#import "PropertyDataSourceResult.h"
#import "PropertyListingResult.h"
#import "PropertyUnkownLocationResult.h"
#import "PropertyLocationsResult.h"
#import "JSONFIleDataSource.h"
#import "JSONWebDataSource.h"
#import "LocationsTableViewSource.h"
#import "RecentSearchesTableViewSource.h"
#import "AppDelegate.h"
#import "RecentSearchDataEntity.h"
#import "SearchItemBase.h"
#import "PlainTextSearchItem.h"
#import "GeolocationSearchItem.h"
#import "PersistentDataStore.h"

@interface PropertySearchViewController ()

@end

@implementation PropertySearchViewController
{
    PropertyDataSource* _dataSource;
    TableViewDataSourceBase*_tableViewSource;
    SearchItemBase* _searchItem;
    CLLocationManager* _locationManager;
    BOOL _awaitingLocation;
    PersistentDataStore* _dataStore;
    PropertyListingResult* _propertyListingsResult;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    JSONWebDataSource* dataSource = [[JSONWebDataSource alloc] init];
    _dataSource = [[PropertyDataSource alloc] initWithDataSource:dataSource];
    
    // create a location manager - used to search the current location
    _locationManager = [[CLLocationManager alloc] init];
    _locationManager.delegate = self;
    _awaitingLocation = NO;
    
    // locates the persistent datastore
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    _dataStore = appDelegate.persistentDataStore;
    
    // set initial UI state
    self.userMessageLabel.text = @"";
    [self showRecentSearches];
    self.loadingIndicator.hidden = YES;
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)performTextSearch:(id)sender
{
    [self.searchBar resignFirstResponder];
    _searchItem = [PlainTextSearchItem plainTextSearchItemFromString:self.searchBar.text];
    [self executeSearch];
}

- (void)searchBarSearchButtonClicked:(UISearchBar *)searchBar
{
    [searchBar resignFirstResponder];
    _searchItem = [PlainTextSearchItem plainTextSearchItemFromString:searchBar.text];
    [self executeSearch];
}

- (IBAction)performGeolocationSearch:(id)sender
{
    [_locationManager startUpdatingLocation];
    _awaitingLocation = YES;
}

- (void) showRecentSearches
{
    if (_dataStore.recentSearches.count > 0)
    {
        // display the recent searches
        _tableViewSource = [RecentSearchesTableViewSource recentSearchesTableViewSourceFromArray:_dataStore.recentSearches];
        [_tableViewSource attachToTableView:self.tableView];
        _tableViewSource.delegate = self;
    }
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations
{
    if (_awaitingLocation)
    {
        CLLocation* location = locations[0];
        _searchItem = [GeolocationSearchItem geolocationSearchItemFromLocation:location.coordinate];
        self.searchBar.text = _searchItem.displayText;
        [_locationManager stopUpdatingLocation];
        
        [self executeSearch];
    }
}

- (void) executeSearch
{
    self.userMessageLabel.text = nil;
    
    PropertyDataSourceResultError error = ^(NSString* errorMessage) {
        self.userMessageLabel.text = errorMessage;
        
        // hide the locations / recent searches table
        self.tableView.dataSource = nil;
        [self.tableView reloadData];
    };
    
    PropertyDataSourceResultSuccess success = ^(PropertyDataSourceResult *result){
        
        // stop the loading indicator
        self.loadingIndicator.hidden = YES;
        [self.loadingIndicator stopAnimating];
        
        // determine the type of returned result
        if ([result isKindOfClass:[PropertyListingResult class]])
        {
            _propertyListingsResult = (PropertyListingResult*)result;

            _searchItem.matches = _propertyListingsResult.totalResults;
            [_dataStore addToRecentSearches:_searchItem];
            [self showRecentSearches];
            
            [self performSegueWithIdentifier:@"Search" sender:self];
            
        }
        else if ([result isKindOfClass:[PropertyLocationsResult class]])
        {
            // display a list of suggested locations
            _tableViewSource = [LocationsTableViewSource locationsTableViewSourceFromArray:[(PropertyLocationsResult*)result locations]];
            [_tableViewSource attachToTableView:self.tableView];
            _tableViewSource.delegate = self;
        }
        else if ([result isKindOfClass:[PropertyUnkownLocationResult class]])
        {
            self.userMessageLabel.text = @"The location given was not recognised.";
            
            // hide the locations / recent searches table
            self.tableView.dataSource = nil;
            [self.tableView reloadData];
        }
    };
    
    self.loadingIndicator.hidden = NO;
    [self.loadingIndicator startAnimating];
    
    [_searchItem findPropertiesWithDataSource:_dataSource
                                   pageNumber:1
                                       result:success
                                        error:error];
}

- (void) itemSelected: (NSObject*) item
{
    if ([item isKindOfClass:[Location class]])
    {
        Location* location = (Location*)item;
        _searchItem = [PlainTextSearchItem plainTextSearchItemFromLocation:location];
    }
    else if ([item isKindOfClass:[RecentSearchDataEntity class]])
    {
        RecentSearchDataEntity* recentSearch = (RecentSearchDataEntity*)item;
        _searchItem = [SearchItemBase fromRecentSearchDataEntity:recentSearch];
    }
    
    self.searchBar.text = _searchItem.displayText;
    [self executeSearch];
}

#pragma mark - Navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Pass the selected object to the new view controller.
    if ([[segue identifier] isEqualToString:@"Search"])
    {
        SearchResultsTableViewController* searchResultsTableViewController = [segue destinationViewController];
        [searchResultsTableViewController setSearchResults:_propertyListingsResult
                              datasource:_dataSource
                              searchItem:_searchItem];
    }
}

@end
