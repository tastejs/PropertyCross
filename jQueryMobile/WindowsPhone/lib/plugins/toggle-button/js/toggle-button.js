/*
 * "toggle button" plugin
 */
(function( $, undefined ) {
    $.widget( "mobile.togglebutton", $.mobile.widget, {

        options: {
            theme : null,
            icon : null,
            checked: null
        },

        _create: function(){
            var $toggleButton = this.element,
                theme = this.options.theme || $toggleButton.jqmData( "theme" ) || $.mobile.getInheritedTheme( $toggleButton, "a" ),
                $toggleIcon = $("<div class='ui-toggle-icon'></div>"),
                $toggleCaption = $("<div class='ui-toggle-caption'></div>"),
                icon = this.options.icon || $toggleButton.jqmData( "icon" );
            $toggleButton.addClass("ui-toggle-button");
            $toggleButton.addClass("ui-toggle-button-"+theme);
            $toggleButton.html($toggleCaption.append($toggleButton.html()));
            $toggleIcon.addClass('ui-icon-'+icon);
            $toggleIcon.insertBefore($toggleCaption);
            this.darkIconStyle = (theme=='a')?'ui-toggle-unchecked':'ui-toggle-checked',
            this.lightIconStyle = (theme=='a')?'ui-toggle-checked':'ui-toggle-unchecked';
            if(this.options.checked || $toggleButton.attr("checked")=='checked'){
                this.checked(true);
            }else{
                this.checked(false);
            }
            this.refresh();
        },

        checked : function(checked){
            var $toggleButton = this.element;
            if(checked === undefined){
                return ($toggleButton.attr('checked'))?true:false;
            }

            if(checked===true){
                $toggleButton.attr('checked',true);
                $toggleButton.removeClass(this.darkIconStyle).addClass(this.lightIconStyle);
            }else{
                $toggleButton.attr('checked',false);
                $toggleButton.removeClass(this.lightIconStyle).addClass(this.darkIconStyle);
            }
        },

        enable: function() {
            var $toggleButton = this.element,
                self = this;
            $toggleButton.attr( "disabled", false );
            $toggleButton.removeClass( "ui-disabled" ).attr( "aria-disabled", false );
            $toggleButton.click(function(){
                var checked = $toggleButton.attr('checked');
                if(checked=='checked'){
                    self.checked(false);
                }else{
                    self.checked(true);
                }
            });
            return this._setOption( "disabled", false );
        },

        disable: function() {
            var $toggleButton = this.element;
            $toggleButton.attr( "disabled", true );
            $toggleButton.addClass( "ui-disabled" ).attr( "aria-disabled", true );
            $toggleButton.unbind('click');
            return this._setOption( "disabled", true );
        },

        refresh: function() {
            if ( this.element.attr("disabled") ) {
                this.disable();
            } else {
                this.enable();
            }
        }

    });

    //auto self-init widgets
    $( document ).bind( "pagecreate create", function( e ){
        $( ":jqmData(role='toggle-button')", e.target ).togglebutton();
    });

})( jQuery );