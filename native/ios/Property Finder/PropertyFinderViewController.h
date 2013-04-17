//
//  ViewController.h
//  Property Finder
//
//  Created by Colin Eberhardt on 11/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//


#import <CoreLocation/CoreLocation.h>
#import <UIKit/UIKit.h>

#import "TableViewDataSourceDelegate.h"

// a view controller that displays the front page of the application
@interface PropertyFinderViewController : UIViewController <TableViewDataSourceDelegate, CLLocationManagerDelegate, UITextFieldDelegate>

@property (weak, nonatomic) IBOutlet UITextField *searchText;
- (IBAction)goButtonTouched:(id)sender;
@property (weak, nonatomic) IBOutlet UIButton *goButton;
@property (weak, nonatomic) IBOutlet UIActivityIndicatorView *loadingIndicator;
@property (weak, nonatomic) IBOutlet UILabel *userMessageLabel;
@property (weak, nonatomic) IBOutlet UITableView *tableView;
- (IBAction)myLocationButtonTouched:(id)sender;

@end
