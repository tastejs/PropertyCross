//
//  GeolocationSearchItem.h
//  Property Finder
//
//  Created by Colin Eberhardt on 24/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import <CoreLocation/CoreLocation.h>
#import "SearchItemBase.h"

// a search for a geolocation.
@interface GeolocationSearchItem : SearchItemBase

@property double latitude;
@property double longitude;

// a factory method
+ (id) geolocationSearchItemFromLocation: (CLLocationCoordinate2D) location;

@end
