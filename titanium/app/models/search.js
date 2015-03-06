// Collection of recent searches, stored in SQLite

exports.definition = {
  config: {

    // No need to define columns, since we don't store locally
    columns: {
      place_name: 'TEXT PRIMARY KEY',
      long_title: 'TEXT',
      title: 'TEXT',
      total_results: 'INTEGER'
    },

    // Use the built-in SQL store adapter
    adapter: {
      type: 'sql',
      collection_name: 'searches',
      idAttribute: 'place_name'
    }
  }
};
