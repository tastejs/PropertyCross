//
//  SearchResultsViewController.h
//  PropertyCross
//
//  Created by Colin Eberhardt on 12/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <UIKit/UIKit.h>

#import "PropertyListingResult.h"
#import "PropertyDataSource.h"
#import "SearchItemBase.h"

// the view controller that displays a list of search results
@interface SearchResultsViewController : UIViewController <UITableViewDataSource, UITableViewDelegate>

@property (weak, nonatomic) IBOutlet UITableView *searchResultsTable;

-(id)initWithResults:(PropertyListingResult*) result
          datasource:(PropertyDataSource*) datsource
          searchItem:(SearchItemBase*) searchItem;

@end
