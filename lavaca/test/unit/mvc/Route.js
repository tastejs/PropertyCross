define(function(require) {

  var Route = require('lavaca/mvc/Route');
  var Controller = require('lavaca/mvc/Controller');

  var route;

  describe('A Route', function() {
    it('can match a route', function() {
      var ob;
      route = new Route('/foo/{param1}', Controller, '', {});
      ob = route.matches('/foo/bar');
      expect(ob).toEqual(true);
      ob = route.matches('/foo/bar/extra/stuff');
      expect(ob).toEqual(false);
    });
    it('can parse a {param}', function() {
      var ob;
      route = new Route('/foo/{param1}', Controller, '', {});
      ob = route.parse('http://sample.com/foo/bar');
      expect(ob.param1).toEqual('bar');
    });
    it('can parse a {param} in a hash url', function() {
      var ob;
      route = new Route('/foo/{param1}', Controller, '', {});
      ob = route.parse('http://sample.com/#/foo/bar');
      expect(ob.param1).toEqual('bar');
      ob = route.parse('http://sample.com/#foo/bar');
      expect(ob.param1).toEqual('bar');
    });
    it('can parse a multiple {param}/{param2}/p{page}', function() {
      var ob;
      route = new Route('/foo/{param1}/{param2}/p{page}', Controller, '', {});
      ob = route.parse('http://sample.com/foo/bar/blog/p1');
      expect(ob.param1).toEqual('bar');
      expect(ob.param2).toEqual('blog');
      expect(ob.page).toEqual('1');
    });
    it('can parse a multiple params inside a url segment {param1}-{param2}', function() {
      var ob;
      route = new Route('/foo/{param1}-{param2}', Controller, '', {});
      ob = route.parse('http://sample.com/foo/bar-blog');
      expect(ob.param1).toEqual('bar');
      expect(ob.param2).toEqual('blog');
    });
    it('can parse {*splat}', function() {
      var ob;
      route = new Route('/foo/{*splat}', Controller, '', {});
      ob = route.parse('http://sample.com/foo/bar/blog/p1');
      expect(ob.splat[0]).toEqual('bar');
      expect(ob.splat[1]).toEqual('blog');
      expect(ob.splat[2]).toEqual('p1');
    });
    it('can parse {*splat} from a hash', function() {
      var ob;
      route = new Route('/foo/{*splat}', Controller, '', {});
      ob = route.parse('http://sample.com/#/foo/bar/blog/p1');
      expect(ob.splat[0]).toEqual('bar');
      expect(ob.splat[1]).toEqual('blog');
      expect(ob.splat[2]).toEqual('p1');
    });
    it('can parse querystring', function() {
      var ob;
      route = new Route('/blog', Controller, '', {});
      ob = route.parse('http://sample.com/blog?cat=test&date=2012-06-14T22%3A30%3A30.181Z');
      expect(ob.cat).toEqual('test');
      expect(ob.date).toEqual('2012-06-14T22:30:30.181Z');
    });
    it('can parse querystring in a hash url', function() {
      var ob;
      route = new Route('/blog', Controller, '', {});
      ob = route.parse('http://sample.com/#/blog?cat=test&date=2012-06-14T22%3A30%3A30.181Z');
      expect(ob.cat).toEqual('test');
      expect(ob.date).toEqual('2012-06-14T22:30:30.181Z');
    });
    it('can parse param and querystring', function() {
      var ob;
      route = new Route('/blog/tag/{tag}', Controller, '', {});
      ob = route.parse('http://sample.com/blog/tag/javascript?cat=test&date=2012-06-14T22%3A30%3A30.181Z');
      expect(ob.tag).toEqual('javascript');
      expect(ob.cat).toEqual('test');
      expect(ob.date).toEqual('2012-06-14T22:30:30.181Z');
    });
    it('can parse {*splat} and querystring', function() {
      var ob;
      route = new Route('/blog/{*splat}', Controller, '', {});
      ob = route.parse('http://sample.com/blog/tag/javascript?cat=test&date=2012-06-14T22%3A30%3A30.181Z');
      expect(ob.splat[0]).toEqual('tag');
      expect(ob.splat[1]).toEqual('javascript');
      expect(ob.cat).toEqual('test');
      expect(ob.date).toEqual('2012-06-14T22:30:30.181Z');
    });
    it('can parse {param} then {*splat}', function() {
      var ob;
      route = new Route('/blog/{param}/{*splat}', Controller, '', {});
      ob = route.parse('http://sample.com/blog/success/tag/javascript');
      expect(ob.splat[0]).toEqual('tag');
      expect(ob.splat[1]).toEqual('javascript');
      expect(ob.param).toEqual('success');
    });
    it('can parse {param}, {*splat} and querystring', function() {
      var ob;
      route = new Route('/blog/{param}/{*splat}', Controller, '', {});
      ob = route.parse('http://sample.com/blog/user/tag/javascript?cat=test&date=2012-06-14T22%3A30%3A30.181Z');
      expect(ob.param).toEqual('user');
      expect(ob.splat[0]).toEqual('tag');
      expect(ob.splat[1]).toEqual('javascript');
      expect(ob.cat).toEqual('test');
      expect(ob.date).toEqual('2012-06-14T22:30:30.181Z');
    });
  });

});
