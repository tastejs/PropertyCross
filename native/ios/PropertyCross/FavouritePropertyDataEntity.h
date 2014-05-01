//
//  FavouritePropertyDataEntity.h
//  PropertyCross
//
//  Created by Colin Eberhardt on 25/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>

// the persistent state for a property which has been marked as a favourite
@interface FavouritePropertyDataEntity : NSManagedObject

@property (nonatomic, retain) NSNumber * price;
@property (nonatomic, retain) NSNumber * bedrooms;
@property (nonatomic, retain) NSNumber * bathrooms;
@property (nonatomic, retain) NSString * summary;
@property (nonatomic, retain) NSString * guid;
@property (nonatomic, retain) NSString * propertyType;
@property (nonatomic, retain) NSString * title;
@property (nonatomic, retain) NSString * thumbnailUrl;
@property (nonatomic, retain) NSString * imageUrl;

@end
