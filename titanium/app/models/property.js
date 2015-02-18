// Collection of properties, read from nestoria API

exports.definition = {
  config: {

    // No need to define columns, since we don't store locally

    // Set our custom nestoria adapter to use the API as data store
    adapter: {
      type: 'nestoria',
      idAttribute: 'guid'
    }
  },
  extendCollection: function(Collection) {
    _.extend(Collection.prototype, {

      // Get the node containing the models form the full API response
      parse: function(response) {
        return response.response.listings;
      }

    });
  },
  extendModel: function(Model) {

    _.extend(Model.prototype, {

      // Add transformations we need to render the model
      transform: function transform() {
        var transformed = this.toJSON();

        transformed.price_formatted_symbol = '£ ' + transformed.price_formatted.substr(0, transformed.price_formatted.length - 1 - transformed.price_currency.length);
        transformed.title_expanded = transformed.title + ' ' + transformed.bedroom_number + ' bed ' + transformed.property_type;

        transformed.stats = transformed.bedroom_number + ' bed ' + transformed.property_type;
        if (transformed.bathroom_number) {
          transformed.stats += ', ' + transformed.bathroom_number + ' ' + (transformed.bathroom_number > 1 ? 'bathrooms' : 'bathroom');
        }

        return transformed;
      }

    });

    return Model;
  }
};
