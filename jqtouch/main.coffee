define ["lib/zepto", "lib/knockout", "cs!viewModel/ApplicationViewModel"], ($, ko, AppVM) ->
    if $.os.android
        # Workaround for broken back button style - as suggested by @dhull on github.. 
        $(".back").removeClass("back").addClass "cancel"
    ko.applyBindings new AppVM()
        
    # if running in phonegap - hide splashscreen when ready (for ios only)..
    document.addEventListener "deviceready", (-> navigator.splashscreen?.hide()), false
