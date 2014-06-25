//
//  PropertySearchViewController.h
//  propertycross
//
//  Created by Matthew Dunsdon on 17/06/2014.
//  Copyright (c) 2014 TasteJS. All rights reserved.
//

#import <CoreLocation/CoreLocation.h>
#import <UIKit/UIKit.h>

#import "TableViewDataSourceDelegate.h"

@interface PropertySearchViewController : UIViewController <TableViewDataSourceDelegate, CLLocationManagerDelegate, UISearchBarDelegate>
- (IBAction)performTextSearch:(id)sender;
- (IBAction)performGeolocationSearch:(id)sender;

@property (weak, nonatomic) IBOutlet UIActivityIndicatorView *loadingIndicator;
@property (weak, nonatomic) IBOutlet UISearchBar *searchBar;
@property (weak, nonatomic) IBOutlet UITableView *tableView;
@property (weak, nonatomic) IBOutlet UILabel *userMessageLabel;

@end
