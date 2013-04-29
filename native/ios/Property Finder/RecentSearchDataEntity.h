//
//  RecentSearchDataEntity.h
//  Property Finder
//
//  Created by Colin Eberhardt on 12/04/2013.
//  Copyright (c) 2013 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>


@interface RecentSearchDataEntity : NSManagedObject

@property (nonatomic, retain) NSString * displayString;
@property (nonatomic, retain) NSNumber * isLocationSearch;
@property (nonatomic, retain) NSNumber * latitude;
@property (nonatomic, retain) NSNumber * longitude;
@property (nonatomic, retain) NSString * searchString;
@property (nonatomic, retain) NSDate * timestamp;
@property (nonatomic, retain) NSNumber * matches;

@end
