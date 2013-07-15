define(function(require) {

  var Cache = require('lavaca/util/Cache'),
      Map = require('lavaca/util/Map');

  var _cache = new Cache(),
      _types = [];

  /**
   * @class Lavaca.ui.Template
   * @super Lavaca.util.Map
   * Abstract type for templates
   */
  var Template = Map.extend({
    /**
     * @method compile
     * Compiles the template
     */
    compile: function() {
      // Do nothing
    },
    /**
     * @method render
     * Renders the template to a string
     *
     * @param {Object} model  The data model to provide to the template
     * @return {Lavaca.util.Promise}  A promise
     */
    render: function() {
      throw 'Abstract';
    },
    /**
     * @method process
     * Parses server data to include in this lookup
     *
     * @param {String} text  The server data string
     */
    process: function(text) {
      this.code = text;
    }
  });
  /**
   * @method get
   * @static
   * Finds the template with a given name
   *
   * @param {String} name  The name of the template
   * @return {Lavaca.ui.Template}  The template (or null if no such template exists)
   */
  Template.get = function(name) {
    return _cache.get(name);
  };
  /**
   * @method init
   * @static
   * Scans the document for all templates with registered types and
   *   prepares template objects from them
   *
   * @sig
   *
   * @sig
   * @param {jQuery} scope  The element to which to limit the scan
   */
  Template.init = function(scope) {
    var i = -1,
        type, templates, templateName, template;

    while (!!(type = _types[++i])) {
      var construct = function(name, src, code) {
        return new type.js(name, src, code);
      };

      // Load pre-compiled templates
      if (typeof type.js.getCompiledTemplates === "function") {
        templates = type.js.getCompiledTemplates();
        for (templateName in templates) {
          template = construct(templateName, null, templates[templateName]);
          template.compiled = true;
          _cache.set(templateName, template);
        }
      }

      // Load un-compiled templates
      if (type.mime) {
        Map.init(_cache, type.mime, construct, scope);
      }
    }
  };
  /**
   * @method dispose
   * @static
   * Disposes of all templates
   */
  Template.dispose = function() {
    Map.dispose(_cache);
  };
  /**
   * @method render
   * @static
   * Finds the named template and renders it to a string
   *
   * @param {String} name  The name of the template
   * @param {Object} model  The data model to provide to the template
   * @return {Lavaca.util.Promise}  A promise
   */
  Template.render = function(name, model) {
    var template = Template.get(name);
    if (!template) {
      throw 'No template named "' + name + '"';
    } else {
      return template.render(model);
    }
  };
  /**
   * @method register
   * @static
   * Registers a type of template to look for on intilization.
   *
   * @sig
   * @param {String} mimeType  The mime-type associated with the template
   * @param {Function} TTemplate  The JavaScript type used for the template (should derive from [[Lavaca.ui.Template]])
   *
   * @sig
   * @param {Function} TTemplate  The JavaScript type used for the template (should derive from [[Lavaca.ui.Template]])
   */
  Template.register = function(mimeType, TTemplate) {
    if (typeof mimeType === "function") {
      TTemplate = mimeType;
      mimeType = null;
    }
    _types[_types.length] = {mime: mimeType, js: TTemplate};
  };

  return Template;

});
