define(function(require) {

  var $ = require('$');
  var PageView = require('lavaca/mvc/PageView');
  var Cache = require('lavaca/util/Cache');
  var Template = require('lavaca/ui/Template');
  var viewManager = require('lavaca/mvc/ViewManager');

  describe('A viewManager', function() {
    beforeEach(function(){
      $('body').append('<div id="view-root"></div><script type="text/dust-template" data-name="hello-world">Hello World</script>');
      Template.init();
      viewManager = new viewManager.constructor();
      viewManager.setEl('#view-root');
    });
    afterEach(function(){
      $('#view-root').remove();
      $('script[data-name="hello-world"]').remove();
    });
    it('can be instantiated via its module constructor', function() {
      expect(viewManager instanceof viewManager.constructor).toBe(true);
    });
    it('can load a view', function() {
      var myPageView = PageView.extend(function(){PageView.apply(this, arguments);},{
            template: 'hello-world'
          }),
          promise,
          response;
      runs(function() {
        promise = viewManager.load('myView', myPageView);
      });
      waitsFor(function() {
        promise.success(function() {
          response = viewManager.pageViews.get('myView').hasRendered;
        });
        return response;
      }, 'a view to be rendered', 300);
      runs(function() {
        expect(response).toBe(true);
      });
    });
    describe('can remove', function() {
      it('a view on a layer and all views above', function() {
        var myPageView = PageView.extend(function(){PageView.apply(this, arguments);},{
            template: 'hello-world'
            }),
            promise,
            secondP,
            response;

        runs(function() {
          promise = viewManager.load('myView', myPageView);
        });
        waitsFor(function() {
          promise.success(function() {
            response = true;
          });
          return response;
        }, 'a view to be rendered', 300);
        runs(function() {
          secondP = viewManager.load('anotherView', myPageView, null, 1);
        });
        waitsFor(function() {
          secondP.success(function() {
            response = true;
          });
          return response;
        }, 'a view to be rendered', 300);
        runs(function() {
          expect($('#view-root').children().length).toBe(2);
          viewManager.dismiss(0);
          expect($('#view-root').children().length).toBe(0);
        });
      });
      it('a view on layer without removing views below', function() {
        var myPageView = PageView.extend(function(){PageView.apply(this, arguments);},{
            template: 'hello-world'
            }),
            promise,
            secondP,
            response;

        runs(function() {
          promise = viewManager.load('myView', myPageView);
        });
        waitsFor(function() {
          promise.success(function() {
            response = true;
          });
          return response;
        }, 'a view to be rendered', 300);
        runs(function() {
          secondP = viewManager.load('anotherView', myPageView, null, 1);
        });
        waitsFor(function() {
          secondP.success(function() {
            response = true;
          });
          return response;
        }, 'a view to be rendered', 300);
        runs(function() {
          expect($('#view-root').children().length).toBe(2);
          viewManager.dismiss(1);
          expect($('#view-root').children().length).toBe(1);
        });
      });
      it('a layer by an el', function() {
        var myPageView = PageView.extend(function(){PageView.apply(this, arguments);},{
              template: 'hello-world',
              className: 'test-view'
            }),
            promise,
            response;
        runs(function() {
          promise = viewManager.load('myView', myPageView);
        });
        waitsFor(function() {
          promise.success(function() {
            response = viewManager.pageViews.get('myView').hasRendered;
          });
          return response;
        }, 'a view to be rendered', 300);
        runs(function() {
          viewManager.dismiss('.test-view');
          expect($('#view-root').children().length).toBe(0);
        });
      });
      it('a layer relative to view object in the cache', function() {
        var myPageView = PageView.extend(function(){PageView.apply(this, arguments);},{
              template: 'hello-world',
              className: 'test-view'
            }),
            promise,
            response;
        runs(function() {
          promise = viewManager.load('myView', myPageView);
        });
        waitsFor(function() {
          promise.success(function() {
            response = viewManager.pageViews.get('myView').hasRendered;
          });
          return response;
        }, 'a view to be rendered', 300);
        runs(function() {
          viewManager.dismiss(viewManager.pageViews.get('myView'));
          expect($('#view-root').children().length).toBe(0);
        });
      });
    });
    it('can empty the view cache', function() {
      var myPageView = PageView.extend(function(){PageView.apply(this, arguments);},{
              template: 'hello-world'
          }),
          promise,
          secondP,
          response;

      runs(function() {
        promise = viewManager.load('myView', myPageView);
      });
      waitsFor(function() {
        promise.success(function() {
          response = true;
        });
        return response;
      }, 'a view to be rendered', 300);
      runs(function() {
        secondP = viewManager.load('anotherView', myPageView, null, 1);
      });
      waitsFor(function() {
        secondP.success(function() {
          response = true;
        });
        return response;
      }, 'a view to be rendered', 300);
      runs(function() {
        viewManager.dismiss(1);
        viewManager.flush();
        expect(viewManager.pageViews).toEqual(new Cache());
        expect(viewManager.layers[0].cacheKey).toEqual('myView');
      });
    });

  });

});
