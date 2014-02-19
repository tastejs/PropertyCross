define(function(require) {

  var Collection = require('lavaca/mvc/Collection');
  var Config = require('lavaca/util/Config');

  /**
   * @class <%= fqn %>
   * @super lavaca.mvc.Collection
   * <%= className %> collection type
   */
  var <%= className %> = Collection.extend(function(){
    Collection.apply(this, arguments);
  },{

  TModel:null

  });

  return <%= className %>;

});
