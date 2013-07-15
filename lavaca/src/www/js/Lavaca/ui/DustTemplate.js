define(function(require) {

  var dust = require('dust'),
      Template = require('lavaca/ui/Template'),
      Config = require('lavaca/util/Config'),
      Promise = require('lavaca/util/Promise'),
      StringUtils = require('lavaca/util/StringUtils'),
      Translation = require('lavaca/util/Translation');
  require('dust-helpers');

  /**
   * @class Lavaca.ui.DustTemplate
   * @super Lavaca.ui.Template
   * Base type for templates that use the dust engine
   *
   * @constructor
   * @param {String} name  The unique name of the template
   * @param {String} src  A URL from which to load the template
   * @param {String} code  The raw string code of the template's body
   */
  var DustTemplate = Template.extend(function() {
    Template.apply(this, arguments);
    var helper = this.prepareHelpers(),
        n;
    if(!dust.helpers) {
      dust.helpers = [];
    }
    for (n in helper) {
      dust.helpers[n] = helper[n];
    }
  }, {
    /**
     * @method prepareHelpers
     * Gets the basis for the template helper object
     *
     * @return {Object}  A map of helper function names to functions
     */
    prepareHelpers: function() {
      return {
        msg: this.helperMsg,
        include: this.helperInclude,
        config: this.helperConfig
      };
    },
    /**
     * @method helperMsg
     * Helper function, exposed in dust templates, that uses
     *   [[Lavaca.util.Translation]] to get localized strings. Accessed as:
     *
     * <dl>
     *
     * <dt>{@msg key="code"/}</dt>
     *   <dd>code&mdash;The key under which the message is stored</dd>
     *
     * <dt>{@msg key="code"}default{/msg}</dt>
     *   <dd>code&mdash;The key under which the message is stored</dd>
     *   <dd>default&mdash;The default markup to display if no translation
     *       is found</dd>
     *
     *
     * <dt>{@msg key="code" locale="en_US"/}</dt>
     *   <dd>code&mdash;The key under which the message is stored</dd>
     *   <dd>locale&mdash;The locale from which to get the message ("en_US")</dd>
     *
     * <dt>{@msg key="code" p0="first" p1=variable /}</dt>
     *   <dd>code&mdash;The key under which the message is stored</dd>
     *   <dd>p0, p1, &hellip; pN&mdash;String format parameters for the message
     *       (See [[Lavaca.util.StringUtils]].format())</dd>
     *
     * </dl>
     *
     * @param {Object} chunk  Dust chunk
     * @param {Object} context  Dust context
     * @param {Object} bodies  Dust bodies
     * @param {Object} params  Parameters passed to the helper
     * @return {String}  Rendered output
     */
    helperMsg: function(chunk, context, bodies, params) {
      var key = dust.helpers.tap(params.key, chunk, context),
          locale = dust.helpers.tap(params.locale, chunk, context),
          translation = Translation.get(key, locale),
          args = [translation],
          i = -1,
          arg;
      if(!translation) {
        return bodies.block ? chunk.render(bodies.block, context) : chunk;
      }
      arg = params['p' + (++i)];
      while (typeof arg !== 'undefined') {
        args.push(dust.helpers.tap(arg, chunk, context));
        arg = params['p' + (++i)];
      }
      return chunk.write(StringUtils.format.apply(this, args));
    },
    /**
     * @method helperInclude
     * Helper function, exposed in dust templates, that uses
     *   [[Lavaca.ui.Template]] to include other templates. Accessed as:
     *
     * <dl>
     *
     * <dt>{@include name="template-name"/}</dt>
     *   <dd>name&mdash;The name under which the template can be referenced</dd>
     *
     * </dl>
     *
     * <strong>Note:</strong> You should always use the include helper instead of
     * the dust.js partial syntax. The dust.js partial syntax may not work as expected.
     *
     * @param {Object} chunk  Dust chunk
     * @param {Object} context  Dust context
     * @param {Object} bodies  Dust bodies
     * @param {Object} params  Parameters passed to the helper
     * @return {String}  Rendered output
     */
    helperInclude: function(chunk, context, bodies, params) {
      var name = dust.helpers.tap(params.name, chunk, context),
          result;

      // Note that this only works because
      // dust renders are synchronous so
      // the .then() is called before this
      // helper function returns
      Template
        .render(name, context.stack.head)
        .then(function(html) {
          result = html;
        });
      return chunk.write(result);
    },
    /**
     * @method helperConfig
     * Helper function, exposed in dust templates, that allows templates
     *   to use data from [[Lavaca.util.Config]]. Accessed as:
     *
     * <dl>
     *
     * <dt>{@config key="config_value"/}</dt>
     *   <dd>key&mdash;The key to read from the config file for the default environment.</dd>
     *
     * <dt>{@config key="config_value" environment="production"/}</dt>
     *   <dd>key&mdash;The key to read from the config file for the specified environment.</dd>
     *
     * <dt>{@config key="config_value"}default{/config}</dt>
     *   <dd>key&mdash;The key to read from the config file</dd>
     *   <dd>default&mdash;The default markup to display if the key
     *       is not found</dd>
     *
     * <dt>{@config key="config_value" p0="first" p1=variable /}</dt>
     *   <dd>key&mdash;The key to read from the config file</dd>
     *   <dd>p0, p1, &hellip; pN&mdash;String format parameters
     *       (See [[Lavaca.util.StringUtils]].format())</dd>
     *
     * </dl>
     *
     * <dt>{@config only="local"}&hellip;{:else}&hellip;{/config}</dt>
     *   <dd>only&mdash;Only render the body content if the current config environment's name matches this key</dd>
     *
     * </dl>
     *
     * <dt>{@config not="production"}&hellip;{:else}&hellip;{/config}</dt>
     *   <dd>not&mdash;Only render the body content if the current config environment's name does NOT match this key</dd>
     *
     * </dl>
     *
     * @param {Object} chunk  Dust chunk
     * @param {Object} context  Dust context
     * @param {Object} bodies  Dust bodies
     * @param {Object} params  Parameters passed to the helper
     * @return {String}  Rendered output
     */
    helperConfig: function(chunk, context, bodies, params) {
      var key = dust.helpers.tap(params.key, chunk, context),
          environment = dust.helpers.tap(params.environment, chunk, context),
          value = environment ? Config.get(environment, key) : Config.get(key),
          args = [value],
          i = -1,
          currentEnvironment, arg;
      if(params.only || params.not) {
        currentEnvironment = Config.currentEnvironment();
        if((params.only && currentEnvironment === params.only) || (params.not && currentEnvironment !== params.not)) {
          return bodies.block ? chunk.render(bodies.block, context) : chunk;
        } else {
          return bodies['else'] ? chunk.render(bodies['else'], context) : chunk;
        }
      }
      if(!value) {
        return bodies.block ? chunk.render(bodies.block, context) : chunk;
      }
      arg = params['p' + (++i)];
      while (typeof arg !== 'undefined') {
        args.push(dust.helpers.tap(arg, chunk, context));
        arg = params['p' + (++i)];
      }
      return chunk.write(StringUtils.format.apply(this, args));
    },
    /**
     * @method compile
     * Compiles the template
     */
    compile: function() {
      Template.prototype.compile.call(this);
      dust.loadSource(dust.compile(this.code, this.name));
    },
    /**
     * @method render
     * Renders the template to a string
     *
     * @param {Object} model  The data model to provide to the template
     * @return {Lavaca.util.Promise}  A promise
     */
    render: function(model) {
      var promise = new Promise(this);
      if (!this.code && this.src) {
        this.load(this.src);
      }
      if (this.code && !this.compiled) {
        this.compile();
        this.compiled = true;
      }
      dust.render(this.name, model, function(err, html) {
        if (err) {
          promise.reject(err);
        } else {
          promise.resolve(html);
        }
      });
      return promise;
    },
    /**
     * @method dispose
     * Makes this template ready for disposal
     */
    dispose: function() {
      delete dust.cache[this.name];
      Template.prototype.dispose.call(this);
    }
  });

  DustTemplate.getCompiledTemplates = function() {
    return dust.cache;
  };

  // Register the Dust template type for later use
  Template.register('text/dust-template', DustTemplate);

  return DustTemplate;

});
