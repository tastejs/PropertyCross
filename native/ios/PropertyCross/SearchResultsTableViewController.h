//
//  SearchResultsTableViewController.h
//  propertycross
//
//  Created by Matthew Dunsdon on 17/06/2014.
//  Copyright (c) 2014 TasteJS. All rights reserved.
//

#import <UIKit/UIKit.h>

#import "PropertyListingResult.h"
#import "PropertyDataSource.h"
#import "SearchItemBase.h"

@interface SearchResultsTableViewController : UITableViewController

- (void)setSearchResults:(PropertyListingResult *)result
              datasource:(PropertyDataSource *)datasource
              searchItem:(SearchItemBase *)searchItem;
@end
