//
//  GeolocationSearchItem.h
//  Property Finder
//
//  Created by Colin Eberhardt on 24/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <CoreLocation/CoreLocation.h>
#import "SearchItemBase.h"

@interface GeolocationSearchItem : SearchItemBase

@property double latitude;
@property double longitude;

+ (id) geolocationSearchItemFromLocation: (CLLocationCoordinate2D) location;

@end
