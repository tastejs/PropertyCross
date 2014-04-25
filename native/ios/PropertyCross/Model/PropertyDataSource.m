//
//  PropertyDataSource.m
//  PropertyCross
//
//  Created by Colin Eberhardt on 11/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "PropertyDataSource.h"
#import "PropertyListingResult.h"
#import "PropertyLocationsResult.h"
#import "PropertyUnkownLocationResult.h"
#import "Property.h"
#import "NSDictionary+DictionaryJSONHelpers.h"

@implementation PropertyDataSource
{
    id<JSONDataSourceProtocol> _dataSource;
}

- (id)initWithDataSource:(id<JSONDataSourceProtocol>)dataSource
{
    self = [super init];
    if (self) {
        _dataSource = dataSource;
    }
    return self;
}

- (void)findPropertiesForLatitude:(double)latitude
                        longitude:(double)longitude
                       pageNumber:(NSNumber *)page
                          success:(PropertyDataSourceResultSuccess)successResult
                            error:(PropertyDataSourceResultError)errorResult
{
    [_dataSource findPropertiesForLatitude:latitude
                                 longitude:longitude
                                pageNumber:page
                                   success:^(NSString *result) {
                                       [self handleResult:result success:successResult];
                                   }
                                     error:^(NSString *errorMessage) {
                                       errorResult(errorMessage);
                                   }];
}

- (void)findPropertiesForSearchString:(NSString *)searchString
                           pageNumber:(NSNumber *)page
                              success:(PropertyDataSourceResultSuccess)successResult
                                error:(PropertyDataSourceResultError)errorResult
{
    [_dataSource findPropertiesForSearchString:searchString
                                    pageNumber:page
                                       success:^(NSString *result) {
                                           [self handleResult:result success:successResult];
                                       }
                                         error:^(NSString *errorMessage) {
                                           errorResult(errorMessage);
                                       }];
}

// handles the JSON string response, converting it into teh resuired Obj-C classes.
- (void) handleResult: (NSString*) result
              success:(PropertyDataSourceResultSuccess)successResult
{
    NSData* resultData = [result dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary* json = [NSJSONSerialization JSONObjectWithData:resultData
                                                         options:kNilOptions
                                                           error:nil];
    
    NSDictionary* response = (NSDictionary*)[json objectForKey:@"response"];
    NSString* responseCode = [response NSStringForKey:@"application_response_code"];
    
    if ([responseCode isEqual:@"100"] || /* one unambiguous location */
        [responseCode isEqual:@"101"] || /* best guess location */
        [responseCode isEqual:@"110"] /* large location, 1000 matches max */)
    {
        PropertyListingResult* listingResult = [PropertyListingResult propertyListingResultFromJSON:response];
        successResult(listingResult);
    }
    else if ([responseCode isEqual:@"200"] || /* ambiguous location */
             [responseCode isEqual:@"202"]  /* mis-spelled location */)
    {
        PropertyLocationsResult* locationResult = [PropertyLocationsResult properertyLocationsResultFromJSON:response];
        successResult(locationResult);
    }
    else
    {
        /*
         201 - unkown location
         210 - coordinate error
         */
        PropertyUnkownLocationResult* locationResult = [[PropertyUnkownLocationResult alloc] init];
        successResult(locationResult);
    }
}

@end
