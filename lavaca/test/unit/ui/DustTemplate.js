define(function(require) {

  var $ = require('$');
  var DustTemplate = require('lavaca/ui/DustTemplate');
  var Translation = require('lavaca/util/Translation');
  var Template = require('lavaca/ui/Template');
  var Config = require('lavaca/util/Config');

  var noop,
      template;

  function _newTemplate(code, name) {
    name = name || 'tmpl';
    $('body').append('<script data-name="' + name + '" type="text/dust-template" class="script-tmpl">' + code + '</script>');
    Template.init();
    return Template.get(name);
  }

  function _newTranslation(code) {
    $('body').append('<script type="text/x-translation" data-name="en_US" class="script-translation">' + code + '</script>');
    Translation.init('en_US');
  }

  describe('DustTemplate', function() {
    beforeEach(function() {
      noop = {
        success: function() { },
        error: function() { }
      };
      spyOn(noop, 'success');
      spyOn(noop, 'error');
    });
    afterEach(function() {
      template.dispose();
      $('.script-tmpl').remove();
      $('.script-translation').remove();
      Translation.dispose();
    });
    it('can render a basic template from a string', function() {
      var source = '{#names}{.}{~n}{/names}',
          context = { names: ['Moe', 'Larry', 'Curly'] };

      template = new DustTemplate('tmpl', null, source);
      template.render(context)
        .success(function(html) {
          expect(html).toEqual('Moe\nLarry\nCurly\n');
        })
        .error(noop.error);

      expect(noop.error).not.toHaveBeenCalled();
    });
    it('can render a basic template from an inline script', function() {
      var source = '{#names}{.}{~n}{/names}',
          context = { names: ['Moe', 'Larry', 'Curly'] },
          template = _newTemplate(source);

      template.render(context)
        .success(function(html) {
          expect(html).toEqual('Moe\nLarry\nCurly\n');
        })
        .error(noop.error);

      expect(noop.error).not.toHaveBeenCalled();
    });
    it('can use a LinkedIn helper', function() {
      var source = '{@eq key="{val}" value="foo"}equal{/eq}',
          context = { val: 'foo' },
          template = _newTemplate(source);

      template.render(context)
        .success(function(html) {
          expect(html).toEqual('equal');
        })
        .error(noop.error);

      expect(noop.error).not.toHaveBeenCalled();
    });
    it('can use a translation', function() {
      var source = '{@msg key="test-value"/}',
          context = {},
          template;

      _newTranslation('{"test-value": "hello world"}');
      template = _newTemplate(source);

      template.render(context)
        .success(function(html) {
          expect(html).toEqual('hello world');
        })
        .error(noop.error);

      expect(noop.error).not.toHaveBeenCalled();
    });
    it('can use an include', function() {
      _newTemplate('<h2>{title}</h2>', 'titleTmpl');
      var parentSource = '<h1>{name}</h1>{@include name="titleTmpl"/}',
          context = {name: 'Larry', title: 'Developer'},
          parentTemplate = _newTemplate(parentSource);

      parentTemplate.render(context)
        .success(function(html) {
          expect(html).toEqual('<h1>Larry</h1><h2>Developer</h2>', 'titleTmpl');
        })
        .error(noop.error);

      expect(noop.error).not.toHaveBeenCalled();
    });
    it('can reference a variable from a config file', function() {
      var source = '<p>{@config key="test_key" environment="test-environment" /}</p>',
          context = {},
          template = _newTemplate(source);

      $('body').append('<script type="text/x-config" data-name="test-environment" id="temp-config-script">{"test_key": "test value"}</script>');
      Config.init();

      template.render(context)
        .success(function(html) {
          expect(html).toEqual('<p>test value</p>');
        })
        .error(noop.error);

      expect(noop.error).not.toHaveBeenCalled();
      Config.dispose();
      $('#temp-config-script').remove();
    });
    it('can selectively render content based on current config environment', function() {
      var source = '<p>{@config only="test-local"}Yes{:else}No{/config}</p>' + 
        '<p>{@config only="test-staging"}Yes{:else}No{/config}</p>' + 
        '<p>{@config only="test-production"}Yes{:else}No{/config}</p>' +
        '<p>{@config not="test-local"}Yes{:else}No{/config}</p>' + 
        '<p>{@config not="test-staging"}Yes{:else}No{/config}</p>' + 
        '<p>{@config not="test-production"}Yes{:else}No{/config}</p>',
      context = {},
      template = _newTemplate(source);

      $('body').append('<script type="text/x-config" data-name="test-local" class="test-configs">{"test_key": "test-local"}</script>');
      $('body').append('<script type="text/x-config" data-name="test-staging" class="test-configs">{"test_key": "test-staging"}</script>');
      $('body').append('<script type="text/x-config" data-name="test-production" class="test-configs">{"test_key": "test-production"}</script>');
      Config.init();

      // Test first environment
      Config.setDefault('test-local');
      template.render(context)
      .success(function(html) {
        expect(html).toEqual('<p>Yes</p><p>No</p><p>No</p><p>No</p><p>Yes</p><p>Yes</p>');
        })
        .error(noop.error);

      // Test second environment
      Config.setDefault('test-production');
      template.render(context)
        .success(function(html) {
          expect(html).toEqual('<p>No</p><p>No</p><p>Yes</p><p>Yes</p><p>Yes</p><p>No</p>');
        })
        .error(noop.error);

      expect(noop.error).not.toHaveBeenCalled();
      Config.dispose();
      $('script.test-configs').remove();
    });
  });

});

