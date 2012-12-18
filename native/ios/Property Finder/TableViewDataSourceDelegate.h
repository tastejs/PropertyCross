//
//  TableViewDataSourceDelegate.h
//  Property Finder
//
//  Created by Colin Eberhardt on 18/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>

// a protocol that indicates selection
@protocol TableViewDataSourceDelegate <NSObject>

- (void) itemSelected: (NSObject*) item;

@end
