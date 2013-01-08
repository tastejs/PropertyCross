function error_message(msg) {
	$("#Searching_label").hide();
	$("#error_message").html(msg);
	$("#recent_search").show();
}

function misspelt_location(place_name) {
	$("#error_message").html(place_name).trigger("create");
	$("#recent_search").hide();
}

function recent_search(recent_search_list) {
	$("#recent_search_list").html(recent_search_list).trigger("create");
}

function my_location(lat_lang) {
	$('#search_field').val(lat_lang);
	$("#Searching_label").show();
	var jqxhr = $.post("/app/PropertyCross/my_location_result", { "place_name": lat_lang }, function() { });
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
					});
			}
		});

	$("#fave_minus").live("click", function() {
			var property_guid = $("#property_guid").html().trim();
			var jqxhr = $.post("/app/PropertyCross/remove_from_favourite", { "guid": property_guid }, function() {
					$('.fave_button_section').html("<a id='fave_plus' data-icon='plus' href='#' style='top:0.2em;' class='ui-btn-right ui-btn ui-btn-icon-left ui-btn-corner-all ui-shadow ui-btn-up-b' data-theme='b'><span class='ui-btn-inner ui-btn-corner-all'><span class='ui-btn-text'>Fave</span><span class='ui-icon ui-icon-plus ui-icon-shadow'></span></span></a>")
				});
		});

	$("#my_location").live('click', function() {
			var jqxhr = $.post("/app/PropertyCross/get_my_location", function() { });
		});

	$("#total_number_of_property").live("click", function() {
			var total_records = $(".number_of_li").html().trim().substr(0, 1);
			var long_title = $("#long_title").html().trim();
			var jqxhr = $.post("/app/PropertyCross/more_search_result", { "page": total_records, "place_name": long_title }, function() { });
		});
});