/*
* "app bar" plugin
*/
(function( $, undefined ) {
    $.widget( "mobile.appbar", $.mobile.widget, {

        _create: function(){

            var self = this,
                $appBar = this.element,
                $appBarBtns = $appBar.children( "a" ),
                theme = $appBar.attr('data-theme')||$appBar.closest('[data-theme]').attr('data-theme')||'a';

            $appBar.addClass( "ui-app-bar ui-app-bar-"+theme);

            $appBarBtns.buttonMarkup({
                corners:	false,
                shadow:		false,
                iconpos:	'top'
            });

            $appBar.children('a').wrapAll( "<div class='ui-app-bar-btn-panel'></div>" );
            $appBar.children('ul').wrapAll( "<div class='ui-app-bar-inside'><div class='ui-app-bar-menu' data-scroll='y'></div></div>" );
            $("<span class='ui-app-bar-dots'>...</span>").appendTo('.ui-app-bar-btn-panel');

            var btnPanel = $appBar.find(".ui-app-bar-btn-panel"),
                expandablePanel = $appBar.find(".ui-app-bar-inside"),
                btnTitles = $("<div class='ui-app-bar-titles' />").insertBefore('.ui-app-bar-menu');

            // add button captions
            btnPanel.find(".ui-btn-text").each(function(index, el){
                btnTitles.append($("<span />").html($(el).html() || ("button " + index)));
            });

            // Close app bar when clicking on any button
            btnPanel.find("a").click(function(ev){
                self.close();
            });

            // open/close app bar when clicking on any place inside the app bar except buttons
            $appBar.click(function(e){
                if((e.target.className!='ui-app-bar-btn-panel')&&(e.target.className!='ui-link')){
                    return;
                }
                if(expandablePanel.is(":visible")) {
                    self.close();
                }
                else self.open();
            });

            //Close app bar when clicking inside content area
            $(".ui-content").click(function(){
                if(expandablePanel.is(":visible")){
                    self.close();
                }
            });
        },

        // Expands app bar using slide animation
        open : function(){
            this.element.find('.ui-app-bar-inside').stop(true, true).slideDown(400, "easeOutQuint")
                .find(".ui-app-bar-menu li").each(function(index, el){ $(el).css({paddingTop: index * 60}); }).animate({paddingTop:0}, "linear");
        },

        // Collapses app bar using slide animation
        close : function(){
            this.element.find('.ui-app-bar-inside').stop(true, true).slideUp(400,"easeOutQuint");
        }
    });

    //auto self-init widgets
    $( document ).bind( "pagecreate create", function( e ){
        $( ":jqmData(role='app-bar')", e.target ).appbar();
    });

})( jQuery );