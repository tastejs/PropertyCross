//
//  TableViewDataSourceBase.h
//  Property Finder
//
//  Created by Colin Eberhardt on 18/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TableViewDataSourceDelegate.h"

@interface TableViewDataSourceBase : NSObject <UITableViewDataSource, UITableViewDelegate>

@property NSArray* items;

@property id<TableViewDataSourceDelegate> delegate;

- (void)attachToTableView: (UITableView*) tableView;

@end
