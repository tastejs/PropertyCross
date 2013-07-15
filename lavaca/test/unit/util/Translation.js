define(function(require) {

  var $ = require('$');
  var Translation = require('lavaca/util/Translation');

  var scope = '.scripts';

  describe('A Translation', function() {
    beforeEach(function() {
      var result = [];
      result.push('<div class="scripts">');
      result.push('<script type="text/x-translation" data-name="en" data-default>\
        {\
          "hello": "Hello!",\
          "goodbye": "Goodbye cruel world!",\
          "apple": "apple",\
          "banana": "banana",\
          "cherry": "cherry"\
        }\
      </script>');
      result.push('<script type="text/x-translation" data-name="es_MX" data-default>\
        {\
          "hello": "�Hola!",\
          "goodbye": "�Adi�s mundo cruel!",\
          "apple": "manzana",\
          "banana": "pl�tano",\
          "cherry": "cereza"\
        }\
      </script>'); 
      result.push('</div>');
      $('body').append(result.join(''));
      Translation.init('en', scope);
    });
    afterEach(function() {
      Translation.dispose();
      $('.scripts').remove();
    });
    it('can be intitialized with a cache of translations', function() {
      expect(Translation.get('hello')).toEqual('Hello!');
      expect(Translation.get('es', 'hello')).toEqual('�Hola!');
      expect(Translation.get('yellow')).toBeNull();
    });
    it('can set the default locale', function() {
      expect(Translation.get('hello')).toEqual('Hello!');
      Translation.setDefault('es');
      expect(Translation.get('hello')).toEqual('�Hola!');
    });
    it('can be disposed', function() {
      Translation.dispose();
      expect(Translation.get('hello')).toBeNull();
    });
  });

});
