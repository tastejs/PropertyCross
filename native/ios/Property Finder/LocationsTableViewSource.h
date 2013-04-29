//
//  LocationsTableViewSource.h
//  Property Finder
//
//  Created by Colin Eberhardt on 18/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Location.h"
#import "TableViewDataSourceBase.h"

// a table source that renders a list of locations
@interface LocationsTableViewSource : TableViewDataSourceBase

+ locationsTableViewSourceFromArray : (NSArray*) locations;

@end
