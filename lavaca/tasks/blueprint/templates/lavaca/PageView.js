define(function(require) {

  var BaseView = require('app/ui/views/BaseView');
  require('rdust!templates/<%=objectName %>');
  var Config = require('lavaca/util/Config');
  var Translation = require('lavaca/util/Translation');

/**
 * @class <%= fqn %>
 * @super app.ui.views.BaseView
 * <%= className %> view type
 */
  var <%= className %> = BaseView.extend(function(){
    BaseView.apply(this, arguments);
  },{
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

  return <%= className %>;

});
