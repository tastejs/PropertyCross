//
//  JSONWebDataSource.m
//  PropertyCross
//
//  Created by Colin Eberhardt on 16/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "JSONWebDataSource.h"

@implementation JSONWebDataSource
{
    NSMutableData* _responseData;
    JSONDataSourceSuccess _successBlock;
    JSONDataSourceError _errorBlock;
}

- (void)findPropertiesForLatitude:(double)latitude
                        longitude:(double)longitude
                       pageNumber:(NSUInteger *)page
                          success:(JSONDataSourceSuccess)successResult
                            error:(JSONDataSourceError) errorResult
{
    _successBlock = successResult;
    _errorBlock = errorResult;
    
    NSString* baseUrl = @"http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&centre_point=";
    NSString* url = [NSString stringWithFormat:@"%@/%f,%f&page=%tu", baseUrl, latitude, longitude, page];
    
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:url]];
    (void)[[NSURLConnection alloc] initWithRequest:request delegate:self];
}

- (void)findPropertiesForSearchString:(NSString *)searchString
                           pageNumber:(NSUInteger *)page
                              success:(JSONDataSourceSuccess)successResult
                                error:(JSONDataSourceError) errorResult        
{
    _successBlock = successResult;
    _errorBlock = errorResult;    
    
    NSString* baseUrl = @"http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&place_name=";
    NSString* url = [NSString stringWithFormat:@"%@/%@&page=%tu", baseUrl, searchString, page];

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
    _errorBlock(@"An error occurred while searching. Please check your network connection and try again.");
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection
{
    NSString* resultString = [[NSString alloc] initWithData:_responseData
                                                   encoding:NSASCIIStringEncoding];
    _successBlock(resultString);
}

@end
