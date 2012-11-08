// WARNING
// This file has been generated automatically by MonoDevelop to
// mirror C# types. Changes in this file made by drag-connecting
// from the UI designer will be synchronized back to C#, but
// more complex manual changes may not transfer correctly.


#import <UIKit/UIKit.h>
#import <MapKit/MapKit.h>
#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>


@interface MainPageViewController : UIViewController {
	UITextField *_searchLocationText;
	UIButton *_goButton;
	UIButton *_myLocationButton;
	UIActivityIndicatorView *_searchActivityIndicator;
	UITableView *_tableView;
	UILabel *_userMessageLabel;
}

@property (nonatomic, retain) IBOutlet UITextField *searchLocationText;

@property (nonatomic, retain) IBOutlet UIButton *goButton;

@property (nonatomic, retain) IBOutlet UIButton *myLocationButton;

@property (nonatomic, retain) IBOutlet UIActivityIndicatorView *searchActivityIndicator;

@property (nonatomic, retain) IBOutlet UITableView *tableView;

@property (nonatomic, retain) IBOutlet UILabel *userMessageLabel;

- (IBAction)myLocationButtonTouched:(id)sender;

- (IBAction)goButtonTouched:(id)sender;

- (IBAction)searchLocationTextChanged:(id)sender;

@end
