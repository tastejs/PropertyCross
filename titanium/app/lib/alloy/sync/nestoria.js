// Custom sync adapter to talk witht the nestoria API
module.exports.sync = function(method, model, options) {

  // Read models from data store
  if (method === 'read') {

    // Extend the defaults in config.json
    var request = _.extend(Alloy.CFG.request || {}, options.request || {});

    // Compose the URL
    var url = Alloy.CFG.url + '?' + _.map(request, function(value, key) {
      return key + '=' + (value ? value : '');
    }).join('&');

    // Create an HTTP Client to talk with the API
    var client = Ti.Network.createHTTPClient({
      timeout: 5000,
      onload: function(e) {
        var responseObj;

        try {
          responseObj = JSON.parse(this.responseText);
        }

        // Invalid JSON
        catch (exception) {
          fail(exception);
          return;
        }

        // Only codes < 200 are truly succesful
        if (parseInt(responseObj.response.application_response_code) < 200) {

          // Pass the full response object
          // The parse-method set in the property.js model will extract the right root
          // This way we still get the full response in the search controller
          options.success(responseObj);
          model.trigger('fetch');
        }

        // Fail, passing both the error and the full response
        else {
          fail(responseObj.response.application_response_text, responseObj);
        }

      },
      onerror: function(e) {
        fail(e.error, e);
      }
    });

    client.open('GET', url);
    client.send();
  }

  // We only read, sorry
  else {
    fail('ERROR: Sync method not supported!');
  }

  function fail(textStatus, errorThrown) {
    options.error(errorThrown, textStatus);
    console.error(textStatus);
    model.trigger('error');
  }
};

// Set the idAttribute on every new model so we can look it up using that field (guid)
module.exports.afterModelCreate = function(Model, name) {
  Model = Model || {};
  Model.prototype.idAttribute = Model.prototype.config.adapter.idAttribute;
  return Model;
};