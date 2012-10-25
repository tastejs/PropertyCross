//
//  RecentSearchesTableViewSource.h
//  Property Finder
//
//  Created by Colin Eberhardt on 18/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "TableViewDataSourceBase.h"

@interface RecentSearchesTableViewSource : TableViewDataSourceBase

+ recentSearchesTableViewSourceFromArray : (NSArray*) recentSearches;


@end
