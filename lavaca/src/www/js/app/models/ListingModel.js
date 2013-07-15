define(function(require) {

  var Model = require('lavaca/mvc/Model');

  var ListingModel = Model.extend(function() {
    Model.apply(this, arguments);
    this.apply({
      'shortTitle': this.setupShortTitle.bind(this),
      'pluralBath': this.pluralBath.bind(this),
      'pluralBed':this.pluralBed.bind(this)
    });
  }, {
    setupShortTitle: function() {
      var title = this.get('title'),
          titleParts;
      titleParts = title.split(',');
      if (titleParts.length > 1) {
        title = titleParts[0] + ',' + titleParts[1];
      }
      return title;
    },
    pluralBath: function() {
      return parseInt(this.get('bathroom_number'), 10) === 1 ? 'bath' : 'baths';
    },
    pluralBed: function() {
      return parseInt(this.get('bedroom_number'), 10) === 1 ? 'bed' : 'beds';
    }
  });

  return ListingModel;

});