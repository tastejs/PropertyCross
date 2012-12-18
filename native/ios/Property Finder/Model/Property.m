//
//  Property.m
//  Property Finder
//
//  Created by Colin Eberhardt on 11/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "Property.h"
#import "NSDictionary+DictionaryJSONHelpers.h"

@implementation Property

- (NSString *)shortTitle
{    
    NSArray* parts = [self.title componentsSeparatedByString:@","];
    if (parts.count >= 2)
    {
        return [NSString stringWithFormat:@"%@/%@", parts[0], parts[1]];
    }
    else
    {
        return self.title;
    }    
}

- (NSString *)formattedPrice
{
    NSNumberFormatter *numberFormat = [[NSNumberFormatter alloc] init];
    [numberFormat setNumberStyle:NSNumberFormatterCurrencyStyle];
    [numberFormat setCurrencySymbol:@"£"];
    [numberFormat setMaximumFractionDigits:0];
    return [numberFormat stringFromNumber:self.price];
}

- (NSString *)bedBathroomText
{
    return [NSString stringWithFormat:@"%d bed, %d bathroom",
            [self.bedrooms intValue], [self.bathrooms intValue]];
}

- (void)toFavouritePropertyDataEntity:(FavouritePropertyDataEntity *)entity
{
    entity.price = self.price;
    entity.bedrooms = self.bedrooms;
    entity.bathrooms = self.bathrooms;
    entity.propertyType = self.propertyType;
    entity.title = self.title;
    entity.summary = self.summary;
    entity.thumbnailUrl = self.thumbnailUrl;
    entity.imageUrl = self.imageUrl;
    entity.guid = self.guid;
}


+ (id)propertyFromJSONData:(NSDictionary *)data
{
    Property* property = [[Property alloc] init];
    
    property.guid = [data NSStringForKey:@"guid"];
    property.price = [data NSNumberForKey:@"price"];
    property.propertyType = [data NSStringForKey:@"property_type"];
    property.bedrooms = [data NSNumberForKey:@"bedroom_number"];
    property.bathrooms = [data NSNumberForKey:@"bathroom_number"];
    property.title = [data NSStringForKey:@"title"];
    property.thumbnailUrl = [data NSStringForKey:@"thumb_url"];
    property.imageUrl = [data NSStringForKey:@"img_url"];
    property.summary = [data NSStringForKey:@"summary"];
    
    return property;
}

+ (id)propertyFromFavouritePropertyDataEntity:(FavouritePropertyDataEntity *)entity
{
    Property* property = [[self alloc] init];
    
    property.price = entity.price;
    property.bedrooms = entity.bedrooms;
    property.bathrooms = entity.bathrooms;
    property.propertyType = entity.propertyType;
    property.title = entity.title;
    property.summary = entity.summary;
    property.thumbnailUrl = entity.thumbnailUrl;
    property.imageUrl = entity.imageUrl;
    property.guid = entity.guid;
    
    return  property;
}



@end
