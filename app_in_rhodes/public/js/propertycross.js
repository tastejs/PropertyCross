function error_message(msg) {
	$("#Searching_label").hide();
	$("#error_message").html(msg);
}

$(document).ready(function() {
	$(".number_of_li").html($("#search_view_results li").size() - 1);

	$("#go").live('click', function() {
			var search_text = $("#search_field").val().trim();
			if (search_text.length == 0) {
				error_message("Search field should not be empty");
			} else {
				$("#Searching_label").show();
				$("#error_message").html("");
				var jqxhr = $.post("/app/PropertyCross/search_listings", {
						"place_name": search_text
					}, function(data) {
						$("#Searching_label").hide();
					});
			}

		});

	$("#fave_plus").live("click", function() {
			var property_object = $("#property_object").html().trim();
			if (property_object.length > 0) {
				var jqxhr = $.post("/app/PropertyCross/add_to_favourite", { "object": property_object }, function() {
						$('.fave_button_section').html("<a id='fave_minus' data-icon='minus' style='top:0.2em;' href='#' class='ui-btn-right ui-btn ui-btn-icon-left ui-btn-corner-all ui-shadow ui-btn-up-b' data-theme='b'><span class='ui-btn-inner ui-btn-corner-all'><span class='ui-btn-text'>Fave</span><span class='ui-icon ui-icon-minus ui-icon-shadow'></span></span></a>")
					})
			}
		});
});