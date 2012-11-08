//
//  AppDelegate.h
//  Property Finder
//
//  Created by Colin Eberhardt on 11/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreData/CoreData.h>

@class PropertyFinderViewController;
@class PersistentDataStore;

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;

// gets the persistent datastore for the application
@property (readonly) PersistentDataStore* persistentDataStore;

@end
