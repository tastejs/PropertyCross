//
//  Property.h
//  Property Finder
//
//  Created by Colin Eberhardt on 11/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FavouritePropertyDataEntity.h"

// a property listing
@interface Property : NSObject

@property NSNumber* price;

@property NSNumber* bedrooms;

@property NSNumber* bathrooms;

@property NSString* summary;

@property NSString* guid;

@property NSString* propertyType;

@property NSString* title;

@property NSString* thumbnailUrl;

@property NSString* imageUrl;

@property (readonly) NSString* bedBathroomText;

@property (readonly) NSString* formattedPrice;

@property (readonly) NSString* shortTitle;

+ (id)propertyFromJSONData:(NSDictionary*) data;

- (void)toFavouritePropertyDataEntity:(FavouritePropertyDataEntity*) entity;

+ (id)propertyFromFavouritePropertyDataEntity:(FavouritePropertyDataEntity*) entity;

@end
