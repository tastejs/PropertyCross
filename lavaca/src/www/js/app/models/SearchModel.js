define(function(require) {

  var Model = require('lavaca/mvc/Model'),
      state = require('./StateModel'),
      merge = require('mout/object/merge'),
      Translation = require('lavaca/util/Translation');

  var SearchModel = Model.extend(function() {
    Model.apply(this, arguments);
    this.apply({
      recentSearches: this.setRecentSearches.bind(this)
    });
  }, {
    defaultQueryParams: {
      action: 'search_listings',
      country: 'uk',
      encoding: 'json',
      listing_type: 'buy',
      pretty: 1
    },
    searchText: function(text, page) {
      var params = merge(this.defaultQueryParams, {
            place_name: text,
            page: page || 1
          });
      this.fetch('api', {dataType: 'jsonp', data: params});
    },
    searchCoords: function(lat, lng, page) {
      var params = merge(this.defaultQueryParams, {
            centre_point: lat + ',' + lng,
            page: page || 1
          });
      this.fetch('api', {dataType: 'jsonp', data: params});
    },
    onFetchSuccess: function(response) {
      response = this.parse(response.response);
      var successStatusCodes = ['100','101','110'],
          ambiguousStatusCodel = ['200','202'],
          responseCode = response.application_response_code,
          errorMessage;
      if (successStatusCodes.indexOf(responseCode) > -1
        || ambiguousStatusCodel.indexOf(responseCode) > -1) {
        if (this.responseFilter && typeof this.responseFilter === 'function') {
          response = this.responseFilter(response, (ambiguousStatusCodel.indexOf(responseCode) > -1));
        }
        this.apply(response, true);
        this.trigger('fetchSuccess', {response: response});
      } else {
        if (response.application_response_text === 'unknown location') {
          errorMessage = Translation.get('not_matched');
        } else if(responseCode === '210') {
          errorMessage = Translation.get('location_not_found');
        } else {
          errorMessage = Translation.get('error_offline');
        }
        response = {
          error: errorMessage,
          search: null
        };
        this.apply(response, true);
        this.trigger('fetchError', {error: response});
      }
    },
    responseFilter: function(response, showLocations) {
      var data = {
        showLocations: showLocations,
        search: response,
        error: null
      };
      if (data.search.listings && data.search.listings.length) {
        var recentSearch = merge({total_results: data.search.total_results}, data.search.locations[0]);
        state.addRecentSearch(recentSearch);
      } else if (!showLocations) {
        data = {
          showLocations: showLocations,
          search: response,
          error: 'This search has no properties.'
        };
      }
      return data;
    },
    setRecentSearches: function() {
      return state.get('recentSearches');
    }
  });

  return SearchModel;

});
