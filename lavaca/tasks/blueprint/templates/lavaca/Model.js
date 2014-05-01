define(function(require) {

  var Model = require('lavaca/mvc/Model');
  var Config = require('lavaca/util/Config');

  /**
   * @class <%= fqn %>
   * @super lavaca.mvc.Model
   * <%= className %> model type
   */
  var <%= className %> = Model.extend(function(){
    Model.apply(this, arguments);
  },{

  });

  return <%= className %>;

});
