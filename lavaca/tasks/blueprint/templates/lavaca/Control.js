define(function(require) {

  var View = require('lavaca/mvc/View'),
      stateModel = require('app/models/StateModel');
  require('rdust!templates/<%=objectName %>');

  /**
   * @class <%= fqn %>
   * @super Lavaca.mvc.View
   * <%= className %> view type
   */
  var <%= className %> = View.extend(function(){
      View.apply(this, arguments);

    }, {
    /**
     * @field {String} template
     * @default '<%=objectName %>'
     * The name of the template used by the view
     */
    template: 'templates/<%=objectName %>',
    /**
     * @field {String} className
     * @default '<%=objectName %>'
     * A class name added to the view container
     */
    className: '<%=objectName %>'

  });

  return new <%= className %>('', stateModel);
});