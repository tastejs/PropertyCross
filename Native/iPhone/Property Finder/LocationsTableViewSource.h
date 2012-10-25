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


@interface LocationsTableViewSource : TableViewDataSourceBase

+ locationsTableViewSourceFromArray : (NSArray*) locations;

@end
