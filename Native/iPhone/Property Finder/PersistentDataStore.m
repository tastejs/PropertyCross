
//
//  PersistentDataStore.m
//  Property Finder
//
//  Created by Colin Eberhardt on 25/10/2012.
//  Copyright (c) 2012 Colin Eberhardt. All rights reserved.
//

#import "PersistentDataStore.h"

@implementation PersistentDataStore
{
    NSManagedObjectContext* _context;
}

@synthesize recentSearches = _recentSearches;
@synthesize favourites = _favourites;

- (id)initWithObjectContext:(NSManagedObjectContext *)context
{
    self = [super init];
    if (self)
    {
        _context = context;
        _recentSearches = [[NSArray alloc] init];
        _favourites = [[NSArray alloc] init];
        
        [self loadState];
    }
    return self;
}

+ (id)persistentDataStoreWithObjectContext:(NSManagedObjectContext *)context
{
    return [[PersistentDataStore alloc] initWithObjectContext:context];
}

- (void)toggleFavourite:(Property *)property
{
    NSMutableArray* mutableFavourites = [NSMutableArray arrayWithArray:_favourites];
    
    FavouritePropertyDataEntity* persistedProperty = [self persistedPropertyForGuid:property.guid];
    
    if (persistedProperty)
    {
        // remove from the favourites list
        [mutableFavourites removeObject:persistedProperty];
        [_context deleteObject:persistedProperty];
    }
    else
    {
        // create a new entity
        FavouritePropertyDataEntity* entity = [NSEntityDescription
                                          insertNewObjectForEntityForName:@"FavouritePropertyDataEntity"
                                          inManagedObjectContext:_context];
        [property toFavouritePropertyDataEntity:entity];
        [mutableFavourites addObject:entity];
    }
    
    _favourites = [NSArray arrayWithArray:mutableFavourites];
    [self persistEntityUpdates];
}

- (FavouritePropertyDataEntity*) persistedPropertyForGuid: (NSString*) guid
{
    // locate thsi guid
    NSUInteger index = [_favourites indexOfObjectPassingTest:^BOOL(id obj, NSUInteger idx, BOOL *stop) {
        return [((FavouritePropertyDataEntity*)obj).guid isEqual:guid];
    }];
    
    if (index != NSNotFound)
    {
        return _favourites[index];
    }
    else
    {
        return nil;
    }
}

- (BOOL)isPropertyFavourited:(Property *)property
{
    return [self persistedPropertyForGuid:property.guid] != nil;
}
    

- (void) loadState
{
    NSFetchRequest* fetchRequest = [[NSFetchRequest alloc] init];
    NSEntityDescription* entity = [NSEntityDescription
                                   entityForName:@"RecentSearchDataEntity"
                                   inManagedObjectContext:_context];
    [fetchRequest setEntity:entity];
    
    NSSortDescriptor* sortByDate = [[NSSortDescriptor alloc] initWithKey:@"timestamp" ascending:NO];
    [fetchRequest setSortDescriptors:[NSArray arrayWithObject:sortByDate]];
    
    NSArray* fetchedObjects = [_context executeFetchRequest:fetchRequest
                                                      error:nil];
    _recentSearches = [NSArray arrayWithArray:fetchedObjects];
    
    NSFetchRequest* favouritesFetchRequest = [[NSFetchRequest alloc] init];
    entity = [NSEntityDescription
                                   entityForName:@"FavouritePropertyDataEntity"
                                   inManagedObjectContext:_context];
    [favouritesFetchRequest setEntity:entity];
    
    fetchedObjects = [_context executeFetchRequest:favouritesFetchRequest
                                             error:nil];
    _favourites = [NSArray arrayWithArray:fetchedObjects];
}

- (void)addToRecentSearches:(SearchItemBase *)searchItem
{
    NSMutableArray* mutableRecentSearches = [NSMutableArray arrayWithArray:_recentSearches];
    
    // do we have a recent search with the same search text?
    NSUInteger index = [_recentSearches indexOfObjectPassingTest:^BOOL(id obj, NSUInteger idx, BOOL *stop) {
        return [((RecentSearchDataEntity*)obj).displayString isEqual:searchItem.displayText];
    }];
    
    // if not add a new one
    if (index == NSNotFound)
    {
        // create a new entity
        RecentSearchDataEntity* entity = [NSEntityDescription
                                          insertNewObjectForEntityForName:@"RecentSearchDataEntity"
                                          inManagedObjectContext:_context];
        [searchItem toRecentSearchDataEntity:entity];
        
        // add to the 'display list'
        [mutableRecentSearches insertObject:entity
                              atIndex:0];
        
        // ensure that we have just 4 or less items
        if (mutableRecentSearches.count > 4)
        {
            entity = [mutableRecentSearches objectAtIndex:mutableRecentSearches.count-1];
            [mutableRecentSearches removeObject:entity];
            [_context deleteObject:entity];
        }
        
        // persist changes
        [self persistEntityUpdates];
        
    }
    else
    {
        // bring the matching item to the top
        RecentSearchDataEntity* entity = _recentSearches[index];
        entity.timestamp = [NSDate date];
        
        [mutableRecentSearches removeObject:entity];
        [mutableRecentSearches insertObject:entity atIndex:0];
        
        // persist this change
        [self persistEntityUpdates];
    }
    
    _recentSearches = [NSArray arrayWithArray:mutableRecentSearches];
}

- (void) persistEntityUpdates
{
    // persist the new entity
    NSError *error;
    if (![_context save:&error]) {
        NSLog(@"Whoops, couldn't save: %@", [error localizedDescription]);
    }
}



@end
