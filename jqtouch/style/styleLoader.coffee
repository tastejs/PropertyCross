# Dynamically imports the correct styles for the platform..
define ["lib/zepto"], ->
    createStyleSheet = (url) ->
        el = $("<link>").attr
            href: url
            rel: "stylesheet"
            type: "text/css"
        $("head").append el

    if $.os.android
        # Workaround for broken Android back button styling
        # - as suggested by @dhull on github..        
        $('.back').removeClass('back').addClass 'cancel'
        createStyleSheet 'themes/jqtouch.css'
    else
        createStyleSheet 'themes/apple.css'
    createStyleSheet 'style/css/app.css'