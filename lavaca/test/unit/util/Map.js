define(function(require) {

  var $ = require('$');
  var Map = require('lavaca/util/Map');
  var Cache = require('lavaca/util/Cache');

  var _cache,
      scope = '.scripts',
      _construct = function(name, src, code) {
        if (code) {
          code = JSON.parse(code);
        }
        return new Map(name, src, code);
      };

  describe('A Map', function() {
    beforeEach(function() {
      var result = [];
      _cache = new Cache();
      result.push('<div class="scripts">'); 
      result.push('<script type="text/x-hash" data-name="local" data-default>{"protocol": "http:","hostname": "src.boilerplate.mm.dev","port": ""}</script>');
      result.push('<script type="text/x-hash" data-name="staging">{"protocol": "http:","hostname": "src.boilerplate.mm.staging","port": ""}</script>');
      result.push('<script type="text/x-hash" data-name="production">{"protocol": "http:","hostname": "src.boilerplate.mm.production","port": ""}</script>');
      result.push('</div>');
      $('body').append(result.join(''));
      Map.init(_cache, 'text/x-hash', _construct, scope);
    });
    afterEach(function() {
      $('.scripts').remove();
    });
    it('can create a cache of lookup tables', function() {
      var isCache = _cache instanceof Cache;
      expect(isCache).toBe(true);
    });
    it('can retrieve an item in a lookup table', function() {
      var result = Map.get(_cache, 'protocol', null, 'default');
      expect(result).toBe('http:');
      result = _cache.get('local').get('protocol');
      expect(result).toBe('http:');
    });
    it('can change default lookup table', function() {
      var result;
      Map.setDefault(_cache, 'staging');
      result = _cache.get('default').get('hostname');
      expect(result).toBe('src.boilerplate.mm.staging');
    });
    it('can add an object to a lookup table', function() {
      _cache.get('local').add({'isSecure': true});
      expect(_cache.get('local').get('isSecure')).toEqual(true);
    });
    it('can proccess JSON into an object on a lookup table', function() {
      _cache.get('local').process('{"isSecure": true}');
      expect(_cache.get('local').get('isSecure')).toEqual(true);
    });
    /* [TODO] Add tests for lookup tables with data-src */ 
  });

});
