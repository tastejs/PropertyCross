//
//  FavouritesViewController.h
//  Property Finder
//
//  Created by Colin Eberhardt on 24/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FavouritesViewController : UIViewController <UITableViewDataSource, UITableViewDelegate>

@property (weak, nonatomic) IBOutlet UITableView *tableView;

@end
