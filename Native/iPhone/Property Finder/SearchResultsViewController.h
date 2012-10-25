//
//  SearchResultsViewController.h
//  Property Finder
//
//  Created by Colin Eberhardt on 12/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <UIKit/UIKit.h>

#import "PropertyListingResult.h"

@interface SearchResultsViewController : UIViewController <UITableViewDataSource, UITableViewDelegate>

@property (weak, nonatomic) IBOutlet UITableView *searchResultsTable;

-(void)setResult:(PropertyListingResult*) result;

@end
