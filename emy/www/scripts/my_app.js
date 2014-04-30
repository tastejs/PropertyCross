;(function(d,w) {
window.myApp = {

	country : 'uk',
	endpoint : "http://api.nestoria.co.uk/api",
	recents : [],
	favorites : [],
	latestResults: [],


	init : function() {
		if(document.body)
		{
			myApp.getFavorites(false);
      if (navigator.splashscreen) {
        navigator.splashscreen.hide();
      }
		}
		else
			setTimeout(myApp.init, 10);
	},

/**** SEARCH ****/

	changeCountry : function(countryCode)
	{
		if(countryCode=='uk') {
			myApp.country = 'uk';
			myApp.endpoint = 'http://api.nestoria.co.uk/api';
		}
		else if(countryCode=='fr') {
			myApp.country = 'fr';
			myApp.endpoint = 'http://api.nestoria.fr/api';
		}
		else if(countryCode=='es') {
			myApp.country = 'es';
			myApp.endpoint = 'http://api.nestoria.es/api';
		}
		else if(countryCode=='it') {
			myApp.country = 'it';
			myApp.endpoint = 'http://api.nestoria.it/api';
		}
		else if(countryCode=='de') {
			myApp.country = 'de';
			myApp.endpoint = 'http://api.nestoria.de/api';
		}
		else if(countryCode=='in') {
			myApp.country = 'in';
			myApp.endpoint = 'http://api.nestoria.in/api';
		}
		else if(countryCode=='br') {
			myApp.country = 'br';
			myApp.endpoint = 'http://api.nestoria.com.br/api';
		}
		else if(countryCode=='au') {
			myApp.country = 'au';
			myApp.endpoint = 'http://api.nestoria.com.au/api';
		}

		// change country select element value
		var options = emy.$('#search_countries option');
		for(var i=0,inb=options.length; i<inb;i++) {
			if(options[i].getAttribute('value')==myApp.country)
				options[i].setAttribute('selected','selected');
			else
				options[i].removeAttribute('selected');
		}

	},

	searchByKeywords : function(keywords, isRecent)
	{
		if(keywords.substr(0,4)=='pos:')
		{
			var location = keywords.substr(4).split(',');
			myApp.searchByLocation({coords:{latitude:location[0], longitude:location[1]}}, isRecent);
		}
		else
		{
			myApp.isRecent = (isRecent)?true:false;
			myApp.callAPI({
				place_name: 		keywords,
				country : 				myApp.country,
				encoding: 			"json",
				action: 					"search_listings",
				callback : 			"nestoriaSearchCallback",
				number_of_results: 20
			});
		}
	},

	searchByLocation : function(position, isRecent)
	{
		// set country based on location - in the ballpark
		myApp.setCountryByLocation(position);

		// set search term to position
		emy.$('#search_term').value = 'pos:'+position.coords.latitude+','+position.coords.longitude;

		myApp.isRecent = (isRecent)?true:false;
        myApp.callAPI({
			centre_point:	position.coords.latitude+','+position.coords.longitude+',20km',
			country : 				myApp.country,
			encoding: 			"json",
			action: 					"search_listings",
			callback : 			"nestoriaSearchCallback",
			number_of_results: 20
        });
	},

	setCountryByLocation : function(position)
	{
		var lat = position.coords.latitude, lng = position.coords.longitude;
		if(lat && lng)
		{
			if(	(lat > 50.51 && lat < 59.38)	&&	(lng > -5.7 && lng < 2.1)	)
					myApp.changeCountry('uk');
			else if(	(lat > 42.92 && lat < 50.7)	&&	(lng > -5.9 && lng < 7.4)	)
					myApp.changeCountry('fr');
			else if(	(lat > 36  && lat < 42.92)		&&	(lng > -9.6 && lng < 2.27)	)
					myApp.changeCountry('es');
			else if(	(lat > 37  && lat < 47)	&&	(lng > -7.4 && lng < 18.45)	)
					myApp.changeCountry('it');
			else if(	(lat > 47  && lat < 54)	&&	(lng > -7.4 && lng < 15.1)	)
					myApp.changeCountry('de');
			else if(	(lat > 8  && lat < 36.7)	&&	(lng > 69 && lng < 89)	)
					myApp.changeCountry('in');
			else if(	(lat > -32  && lat < 4)	&&	(lng > -72 && lng < -34)	)
					myApp.changeCountry('br');
			else if(	(lat > -32  && lat < 4)	&&	(lng > -72 && lng < -34)	)
					myApp.changeCountry('au');
		}
	},

	callAPI : function(options)
	{
		var params = emy.param(options);
		var script = document.createElement('script');
		script.src = myApp.endpoint+'?'+params;
		console.log(script.src);
		script.id='nestoriaCall';
		document.body.appendChild(script);
	},

	getMyLocation : function(callback)
	{
		if('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(function(position) {
				callback(position);
			}, function(error) {
				var msg='';
				switch(error.code) {
					case error.TIMEOUT:
						msg = "Geolocation timeout";
					break;
					case error.PERMISSION_DENIED:
						msg = "Permission denied";
					break;
					case error.POSITION_UNAVAILABLE:
						msg = "Position is unavailable";
					break;
					case error.UNKNOWN_ERROR:
						msg = "Unknown error";
					break;
				}
			}, {maximumAge:600000,enableHighAccuracy:true});
		}
	},


/**** LISTINGS ****/
	generateListing : function(datas)
	{
		var listContainer = document.createElement('div');
		var listTitle = datas['listings'].length+' of '+datas.total_results;
		var listContent = '<section id="search_results" data-title="'+listTitle+'" data-onshow="myApp.viewHandler()">';
		// draw the list
		listContent += '<ul>';
		for(var i=0,inb=datas['listings'].length;i<inb;i++)
		{
			var item = datas['listings'][i];
			listContent+='<li><a href="javascript:myApp.showSheet(\''+item.guid+'\')">';
			listContent+='<img src="'+item.thumb_url+'" width="70" height="70">';
			listContent+='<div><span class="price">'+item.price_formatted+'</span><span class="name">'+item.lister_name+'</span><span class="title">'+item.title+'</span></div>';
			listContent+='</a></li>';
		}

		// add load more button
		if(i==inb)
			listContent += '<li><a onclick="myApp.loadMore()">Load more...</a></li>';

		listContent+='</ul></section>';
		listContainer.innerHTML = listContent;
		emy.insertViews(listContainer);
	},

	loadMore : function(datas)
	{

	},


/**** SHEETS ****/
	showSheet : function(guid)
	{
		for(var i=0,inb=myApp.latestResults.length;i<inb;i++) {
			if(myApp.latestResults[i].guid == guid) {
				myApp.currentSheet = myApp.latestResults[i];
				break;
			}
		}
		myApp.generateSheet();
	},

	generateSheet : function()
	{
		var sheetData = myApp.currentSheet;
		var sheetContainer = document.createElement('div');
		var sheetContent = '<section id="sheet" data-title="'+sheetData.title+'" class="panel" data-onshow="myApp.viewHandler()">';
		sheetContent += '<h2>'+sheetData.price_formatted+'</h2>';
		sheetContent += '<fieldset>';
		sheetContent += '	<div class="row title">';
		sheetContent += '		<p>'+sheetData.title+'</p>';
		sheetContent += '	</div>';
		sheetContent += '	<div class="row thumb"><img src="'+sheetData.img_url+'" width="100%" style="display:block"></div>';
		sheetContent += '	<div class="row desc">';
		sheetContent += '		<p>'+sheetData.bedroom_number+' bed '+sheetData.property_type+', '+sheetData.bathroom_number+' bathroom</p>';
		sheetContent += '		<p>'+sheetData.summary+'</p>';
		sheetContent += '		<p>source: '+sheetData.datasource_name+'</p>';
		sheetContent += '	</div>';
		sheetContent += '</fieldset>';
		sheetContent += '</section>';
		sheetContainer.innerHTML = sheetContent;
		emy.insertViews(sheetContainer);
	},


/**** RECENTS ******/
	addToRecents : function(o)
	{
		myApp.recents.push(o);
		var recentList = emy.$('#recentsList');
		recentList.innerHTML += '<li><a onclick="myApp.showRecent(\''+o.keyword+'\', \''+o.country+'\')">'+o.keyword+', '+o.country+'</a></li>';
		emy.$('#recents').className='';
	},

	showRecent : function(keyword, country)
	{
		myApp.changeCountry(country);
		myApp.searchByKeywords(keyword, true);
	},


/**** FAVORITES ****/
	loadFavorite : function(guid)
	{
		for(var i=0,inb=myApp.favorites.length;i<inb;i++) {
			if(myApp.favorites[i].guid == guid) {
				myApp.currentSheet = myApp.favorites[i];
				break;
			}
		}
		myApp.generateSheet();
	},

	addFavorite : function()
	{
		if(!myApp.isFavorite(myApp.currentSheet.guid))
		{
			var datas = {
				'guid' : myApp.currentSheet.guid,
				'title' : myApp.currentSheet.title,
				'lister_name' : myApp.currentSheet.lister_name,
				'price_formatted' : myApp.currentSheet.price_formatted,
				'img_url' : myApp.currentSheet.img_url,
				'thumb_url' : myApp.currentSheet.thumb_url,
				'bedroom_number' : myApp.currentSheet.bedroom_number,
				'property_type' : myApp.currentSheet.property_type,
				'bathroom_number' : myApp.currentSheet.bathroom_number,
				'summary' : myApp.currentSheet.summary,
				'datasource_name' : myApp.currentSheet.datasource_name
			};

			myApp.favorites.push(datas);
			window.localStorage.setItem('propertycross-emy-favorites', JSON.stringify(myApp.favorites));
			emy.$('#tlb_favorites_add').style.display='none';
			emy.$('#tlb_favorites_remove').style.display='block';
			myApp.getFavorites(false);
			return true;
		}
		else
			return false;
	},

	removeFavorite : function()
	{
		if(myApp.favorites && myApp.favorites.length > 0)
		{
			var temp = [];
			for(var i=0,inb=myApp.favorites.length;i<inb;i++) {
				if(myApp.favorites[i].guid != myApp.currentSheet.guid) {
					temp.push(myApp.favorites[i]);
				}
			}
			myApp.favorites = temp;
			window.localStorage.setItem('propertycross-emy-favorites', JSON.stringify(myApp.favorites));
			var cleanguid = myApp.currentSheet.guid.replace(/=/g,"");
			emy.$('#fav-'+cleanguid).parentNode.removeChild(emy.$('#fav-'+cleanguid));
			myApp.getFavorites(false);
		}

		emy.$('#tlb_favorites_add').style.display='block';
		emy.$('#tlb_favorites_remove').style.display='none';
	},

	getFavorites : function(go)
	{
		if('localStorage' in window)
		{
			myApp.favorites = JSON.parse(window.localStorage.getItem('propertycross-emy-favorites'));

			var favContainer = document.createElement('div'), out;
			var favContent = '<section id="favorites" data-title="My Favorites" data-onshow="myApp.viewHandler()">';
			favContent += '<ul>';
			if(myApp.favorites && myApp.favorites.length > 0)
			{
				for(var i=0,inb=myApp.favorites.length;i<inb;i++) {
					var item = myApp.favorites[i];
					var cleanguid = item.guid.replace(/=/g,"");
					favContent+='<li id="fav-'+cleanguid+'"><a href="javascript:myApp.loadFavorite(\''+item.guid+'\')">';
					favContent+='<img src="'+item.thumb_url+'" width="70" height="70">';
					favContent+='<div><span class="price">'+item.price_formatted+'</span><span class="name">'+item.lister_name+'</span><span class="title">'+item.title+'</span></div>';
					favContent+='</a></li>';
				}
			}
			else {
				favContent+='<li>Nothing in here...</li>';
				myApp.favorites = [];
			}

			favContent+='</ul></section>';
			favContainer.innerHTML = favContent;
			emy.insertViews(favContainer, go);
		}
	},

	isFavorite : function(guid)
	{
		var out=false;
		if(myApp.favorites && myApp.favorites.length > 0)
		{
			for(var i=0,inb=myApp.favorites.length;i<inb;i++) {
				if(myApp.favorites[i].guid == guid) {
					out= true;
					break;
				}
			}
		}
		return out;
	},

	viewHandler : function()
	{
		var view = emy.getSelectedView().id;
		emy.$('#tlb_favorites_add').style.display='none';
		emy.$('#tlb_favorites_remove').style.display='none';
		emy.$('#tlb_favorites_list').style.display='none';

		if(view=='sheet') {
			if(myApp.isFavorite(myApp.currentSheet.guid))
				emy.$('#tlb_favorites_remove').style.display='block';
			else
				emy.$('#tlb_favorites_add').style.display='block';
		}
		else if(view=='home') {
			emy.$('#tlb_favorites_list').style.display='block';
		}
	}

};
document.addEventListener('deviceready', myApp.init, false);
}(document, window));

function nestoriaSearchCallback(datas, isRecent)
{
	// ONCE API SEND INFOS
	document.body.removeChild(emy.$('#nestoriaCall'));
	if(datas.response.application_response_code==100)
	{
		myApp.latestResults = datas.response.listings;

		// ADD THIS RESULT TO RECENTS
		if(!myApp.isRecent)
		{
			// CHECK IF NOT ALREADY IN RECENTS
			for(var i=0,inb=myApp.recents.length; i<inb; i++) {
				if(myApp.recents[i].country == datas.request.country && myApp.recents[i].keyword == datas.request.location)
					myApp.isRecent = true;
			}

			// IF NOT ALREADY IN RECENTS
			if(!myApp.isRecent)
			{
				myApp.addToRecents({
					'country': datas.request.country,
					'keyword': datas.request.location,
					'location' : datas.response.locations[0],
					'results' : datas.response.total_results
				});
			}
		}
	}
	myApp.generateListing(datas.response);
}
