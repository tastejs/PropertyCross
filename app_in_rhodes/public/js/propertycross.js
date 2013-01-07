$(document).ready(function() {

	$("#go").live('click', function() {
			var search_text = $("#search_field").val().trim();
			if (search_text.length == 0) {
				alert("Search field should not be empty");
			} else {
			}

		});

});