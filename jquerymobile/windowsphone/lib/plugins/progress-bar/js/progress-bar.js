/*
 * "progress bar" plugin
 */
(function( $, undefined ) {
    $.widget( "mobile.progressbar", $.mobile.widget, {

        options: {
            indeterminate: false
        },

        _create: function(){
            var progressBar = this.element[0],
                progressBackground = document.createElement("div"),
                progressValue = document.createElement("div");

            progressBar.className = "ui-progress-bar";
            progressBackground.className = 'ui-progress-bg';
            progressValue.className = 'ui-progress-value';
            progressBar.appendChild(progressBackground);
            progressBar.appendChild(progressValue);

            this.value(progressBar.getAttribute('value')||0);
            if(this.options.indeterminate){
                progressBar.setAttribute('indeterminate',true);
            }
        },

        value : function(newValue){

            var progressBar = this.element[0];
            if(!newValue && newValue!=0){
                return parseFloat(progressBar.getAttribute("value"));
            }
            var newValue = parseFloat(newValue);
            if(isNaN(newValue)){
                return;
            }
            var max = !isNaN(parseFloat(progressBar.getAttribute("max")))?parseFloat(progressBar.getAttribute("max")):100,
                min = !isNaN(parseFloat(progressBar.getAttribute("min")))?parseFloat(progressBar.getAttribute("min")):0;

            if( newValue < min ){
                newValue = min;
            }
            if( newValue > max){
                newValue = max;
            }

            progressBar.setAttribute("value",newValue);
            var width = newValue*100/max;
            progressBar.lastChild.style.width= width+'%';
        },

        indeterminate : function(isIndetermitate){

            var progressBar = this.element[0];

            if(isIndetermitate===true){
                progressBar.setAttribute('indeterminate',true);
            }else{
                progressBar.setAttribute('indeterminate',false);
            }

        }

    });

    //auto self-init widgets
    $( document ).bind( "pagecreate create", function( e ){
        $( ":jqmData(role='progress-bar')", e.target ).progressbar();
    });

})( jQuery );