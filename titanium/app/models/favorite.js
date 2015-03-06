// Collection of favorite properties, stored in SQLite

exports.definition = {
  config: {

    // Because we use SQL store we need to define columns
    columns: {
      guid: 'TEXT PRIMARY KEY',
      title: 'TEXT',
      price_formatted: 'TEXT',
      price_currency: 'TEXT',
      bathroom_number: 'INTEGER',
      bedroom_number: 'INTEGER',
      property_type: 'TEXT',
      img_url: 'TEXT',
      summary: 'TEXT'
    },

    // Use the built-in SQL store adapter
    adapter: {
      type: 'sql',
      collection_name: 'favorites',
      idAttribute: 'guid'
    }
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
