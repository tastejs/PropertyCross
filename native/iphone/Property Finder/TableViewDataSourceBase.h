//
//  TableViewDataSourceBase.h
//  Property Finder
//
//  Created by Colin Eberhardt on 18/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TableViewDataSourceDelegate.h"

// Provides a generic implementation of the UITableViewDataSource and
// UITableViewDelegate protocols for rendering a table 'backed' by an NSArray of objects.
// This class also supports selection via the TableViewDataSourceDelegate.
@interface TableViewDataSourceBase : NSObject <UITableViewDataSource, UITableViewDelegate>

// the items that are rendered in the table
@property NSArray* items;

// a delegate that receives selection 'events'
@property id<TableViewDataSourceDelegate> delegate;

// associates the give UITableView with this class
- (void)attachToTableView: (UITableView*) tableView;

@end
