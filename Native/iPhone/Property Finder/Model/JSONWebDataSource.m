//
//  JSONWebDataSource.m
//  Property Finder
//
//  Created by Colin Eberhardt on 16/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "JSONWebDataSource.h"

@implementation JSONWebDataSource
{
    NSMutableData* _responseData;
    JSONDataSourceSuccess _successBlock;
}

- (void)findPropertiesForLatitude:(double)latitude
                        longitude:(double)longitude
                          success:(JSONDataSourceSuccess)successResult
{
    _successBlock = successResult;
    
    NSString* baseUrl = @"http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&centre_point=";
    NSString* url = [NSString stringWithFormat:@"%@/%f,%f", baseUrl, latitude, longitude];
    
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:url]];
    (void)[[NSURLConnection alloc] initWithRequest:request delegate:self];
}

- (void)findPropertiesForSearchString:(NSString *)searchString
                              success:(JSONDataSourceSuccess)successResult
{
    _successBlock = successResult;
    
    NSString* baseUrl = @"http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&place_name=";
    NSString* url = [NSString stringWithFormat:@"%@/%@", baseUrl, searchString];

    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:url]];
    (void)[[NSURLConnection alloc] initWithRequest:request delegate:self];

}

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response
{
    _responseData = [[NSMutableData alloc] init];
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data
{
    [_responseData appendData:data];
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error
{
    
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection
{
    NSString* resultString = [[NSString alloc] initWithData:_responseData
                                                   encoding:NSASCIIStringEncoding];
    _successBlock(resultString);
}

@end
