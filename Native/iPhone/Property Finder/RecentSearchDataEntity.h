//
//  RecentSearchDataEntity.h
//  Property Finder
//
//  Created by Colin Eberhardt on 24/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>


@interface RecentSearchDataEntity : NSManagedObject

@property (nonatomic, retain) NSString * searchString;
@property (nonatomic, retain) NSDate * timestamp;
@property (nonatomic, retain) NSString * displayString;
@property (nonatomic, retain) NSNumber * latitude;
@property (nonatomic, retain) NSNumber * longitude;
@property (nonatomic, retain) NSNumber * isLocationSearch;

@end
