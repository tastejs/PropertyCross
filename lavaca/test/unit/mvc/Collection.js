define(function(require) {

  var Collection = require('lavaca/mvc/Collection');
  var Model = require('lavaca/mvc/Model');
  var ArrayUtils = require('lavaca/util/ArrayUtils');


  describe('A Collection', function() {
    var testCollection,
        colors;
    beforeEach(function() {
      testCollection = new Collection();
      colors = [
        {id: 1, color: 'red', primary: true},
        {id: 2, color: 'green', primary: true},
        {id: 3, color: 'blue', primary: true},
        {id: 4, color: 'yellow', primary: false}
      ];
    });
    afterEach(function() {
     // testCollection.clear();
    });
    it('can be initialized', function() {
      expect(testCollection instanceof Collection).toEqual(true);
    });
    it('can be initialized with a list of models', function() {
      testCollection = new Collection(colors);
      expect(testCollection.count()).toEqual(4);
    });
    it('can be initialized with a hash of attributes', function() {
      testCollection = new Collection(colors, {
        extra: 'stuff'
      });
      expect(testCollection.get('extra')).toEqual('stuff');
    });
    it('can be cleared of all its models', function() {
      testCollection = new Collection(colors);
      testCollection.clear();
      expect(testCollection.count()).toEqual(0);
    });
    it('can add models with a custom model type', function() {
      var colorModel = Model.extend({
            isBlack: function() {
              return this.get('color') === 'black';
            }
          }),
          colorCollection = Collection.extend({
            TModel: colorModel
          });
      testCollection = new colorCollection(colors);
      expect(testCollection.models[0] instanceof colorModel).toEqual(true);
    });
    it('can insert models at a specified index', function() {
      var items = [
            {id: 3, color: 'blue', primary: true},
            {id: 4, color: 'yellow', primary: false},
            {id: 5, color: 'orange', primary: false},
            {id: 6, color: 'purple', primary: false},
            {id: 7, color: 'magenta', primary: false}
          ],
          noop = {
            addItem: function() {},
            removedItem: function() {}
          },
          expectedResult = [];
      spyOn(noop, 'addItem');
      spyOn(noop, 'removedItem');
      testCollection = new Collection(colors);
      testCollection.on('addItem', noop.addItem);
      testCollection.on('removeItem', noop.removedItem);
      testCollection.insert(1, items);
      expect(noop.addItem.callCount).toEqual(5);
      expect(noop.removedItem.callCount).toEqual(2);
      expectedResult = [colors[0]].concat(items).concat([colors[1]]);
      expect(testCollection.toObject().items).toEqual(expectedResult);
    });
    it('can find the index of a model matching an attribute hash', function() {
      testCollection = new Collection(colors);
      expect(testCollection.indexOf({id: 2, color: 'green'})).toEqual(1);
      expect(testCollection.indexOf({id: 500, color: 'green'})).toEqual(-1);
    });
    it('can find the index of a model matching a functional test', function() {
      var testFunc = function(index, model) {
            return model.get('id') === 2;
          };
      testCollection = new Collection(colors);
      expect(testCollection.indexOf(testFunc)).toEqual(1);
      testCollection.remove(1);
      expect(testCollection.indexOf(testFunc)).toEqual(-1);
    });
    it('can move an item to a new index', function() {
      testCollection = new Collection(colors);
      testCollection.on('moveItem', function(e) {
        expect(testCollection.itemAt(3).toObject()).toEqual(colors[0]);
        expect(e.index).toBe(3);
      });
      testCollection.moveTo(0, 3);
    });
    it('can be filtered by attributes', function() {
      var filteredArray;
      testCollection = new Collection(colors);
      filteredArray = testCollection.filter({'primary': true});
      expect(filteredArray.length).toEqual(3);
      filteredArray = testCollection.filter({'primary': true}, 2);
      expect(filteredArray.length).toEqual(2);
    });
    it('can be filtered by a function', function() {
      var filteredArray;
      testCollection = new Collection(colors);
      filteredArray = testCollection.filter(function(i, item) {
        return item.get('primary');
      });
      expect(filteredArray.length).toEqual(3);
      filteredArray = testCollection.filter(function(i, item) {
        return item.get('primary');
      }, 2);
      expect(filteredArray.length).toEqual(2);
    });
    it('can return the first item that matches a test', function() {
      var filteredArray;
      testCollection = new Collection(colors);
      filteredArray = testCollection.first({'primary': true});
      expect(filteredArray instanceof Model).toEqual(true);
      filteredArray = testCollection.first(function(i, item) {
        return item.get('primary');
      });
      expect(filteredArray instanceof Model).toEqual(true);
    });
    it('can iterate on its models with each()', function() {
      var myCount = 0;
      testCollection = new Collection(colors);
      testCollection.each(function(i, item) {
        if(item.get('primary')) {
          myCount++;
        }
      });
      expect(myCount).toEqual(3);
    });
    it('can stop iteration early', function() {
      var myCount = 0;
      testCollection = new Collection(colors);
      testCollection.each(function(i, item) {
        myCount++;
        if (item.get('color') === 'blue') {
          return false;
        }
      });
      expect(myCount).toEqual(3);
    });
    it('can convert its models into an object of attributes', function() {
      testCollection = new Collection(colors);
      expect(testCollection.toObject().items).toEqual(colors);
    });
    it('triggers addItem event when a model is added', function() {
      var noop = {
            addItem: function() {}
          };
      spyOn(noop, 'addItem');
      testCollection = new Collection(colors);
      testCollection.on('addItem', noop.addItem);
      testCollection.add({color: 'purple', primary: false});
      expect(noop.addItem.callCount).toEqual(1);
    });
    it('triggers changeItem event when a model is changed', function() {
      var noop = {
            changeItem: function(e) {
              expect(e.model).toEqual(testCollection.itemAt(4));
            }
          };
      spyOn(noop, 'changeItem').andCallThrough();
      testCollection = new Collection(colors);
      testCollection.on('changeItem', noop.changeItem);
      testCollection.add({color: 'purple', primary: false});
      testCollection
        .itemAt(4)
        .set('color', 'grey');
      expect(noop.changeItem).toHaveBeenCalled();
    });
    it('triggers moveItem events when models are moved', function() {
      var noop = {
            moveItem: function(e) {
              moveRecords.push([e.model.get('testVal'), e.previousIndex, e.index]);
            }
          },
          moveRecords = [];
      spyOn(noop, 'moveItem').andCallThrough();
      testCollection.on('moveItem', noop.moveItem);
      testCollection.add([
        { testVal: 'B' },
        { testVal: 'C' },
        { testVal: 'A' },
        { testVal: 'D' }
      ]);
      testCollection.moveTo(2, 1);
      expect(testCollection.sort('testVal').toObject().items).toEqual([
        { testVal: 'A' },
        { testVal: 'B' },
        { testVal: 'C' },
        { testVal: 'D' }
      ]);
      expect(noop.moveItem.callCount).toEqual(3);
      expect(moveRecords).toEqual([
        ['A', 2, 1],
        ['A', 1, 0],
        ['B', 0, 1]
      ]);
    });
    it('triggers removeItem event models items are removed', function() {
       var noop = {
            removedItem: function(e) {
              expect(e.model).toEqual(model);
            }
          },
          model;
      spyOn(noop, 'removedItem').andCallThrough();
      testCollection = new Collection(colors);
      testCollection.on('removeItem', noop.removedItem);
      model = testCollection.itemAt(1);
      testCollection.remove(1);
      expect(noop.removedItem).toHaveBeenCalled();
    });
    it('can sort via a specified attribute name', function() {
      var noop = {
        moveItem: function() {}
      };
      spyOn(noop, 'moveItem');
      testCollection.on('moveItem', noop.moveItem);
      testCollection.add([
        { testVal: 'B' },
        { testVal: 'C' },
        { testVal: 'A' }
      ]);
      expect(testCollection.sort('testVal').toObject().items).toEqual([
        { testVal: 'A' },
        { testVal: 'B' },
        { testVal: 'C' }
      ]);
      expect(noop.moveItem.callCount).toEqual(3);
    });
    it('can sort via a specified attribute name in descending order', function() {
      var noop = {
        moveItem: function() {}
      };
      spyOn(noop, 'moveItem');
      testCollection.on('moveItem', noop.moveItem);
      testCollection.add([
        { testVal: 'B' },
        { testVal: 'C' },
        { testVal: 'A' }
      ]);
      expect(testCollection.sort('testVal', true).toObject().items).toEqual([
        { testVal: 'C' },
        { testVal: 'B' },
        { testVal: 'A' }
      ]);
      expect(noop.moveItem.callCount).toEqual(2);
    });
    it('can sort via a compare function', function() {
      var noop = {
            moveItem: function() {}
          };

      function compareFunc(modelA, modelB) {
        var a = modelA.get('testVal'),
            b = modelB.get('testVal');
        return a === b
                  ? 0
                  : a < b
                    ? -1
                    : 1;
      }
      spyOn(noop, 'moveItem').andCallThrough();
      testCollection.on('moveItem', noop.moveItem);
      testCollection.add([
        { testVal: 'B' },
        { testVal: 'C' },
        { testVal: 'A' }
      ]);
      expect(testCollection.sort(compareFunc).toObject().items).toEqual([
        { testVal: 'A' },
        { testVal: 'B' },
        { testVal: 'C' }
      ]);
      expect(noop.moveItem.callCount).toEqual(3);
    });
    it('can reverse order of models', function() {
      testCollection.add([
        { testVal: 'A' },
        { testVal: 'B' },
        { testVal: 'C' }
      ]);
      expect(testCollection.reverse().toObject().items).toEqual([
        { testVal: 'C' },
        { testVal: 'B' },
        { testVal: 'A' }
      ]);
    });
    it('can clear models without clearing attributes', function() {
      testCollection.add(colors);
      testCollection.set('attrKey', 'attrValue');
      expect(testCollection.count()).toEqual(4);
      testCollection.clearModels();
      expect(testCollection.get('attrKey')).toEqual('attrValue');
      expect(testCollection.count()).toEqual(0);
      expect(testCollection.changedOrder).toEqual(false);
      ['addedItems', 'changedItems', 'models', 'removedItems'].forEach(function(key) {
        expect(ArrayUtils.isArray(testCollection[key])).toBe(true);
        expect(testCollection[key].length).toEqual(0);
      });
    });
    it('can remove one or more items by passing in comma separated params', function () {
      testCollection.add(colors);
      testCollection.remove({color: 'red', primary: true});
      expect(testCollection.count()).toEqual(3);
      testCollection.remove({color: 'blue'}, {color: 'green'});
      expect(testCollection.count()).toEqual(1);
      expect(testCollection.first({color: 'blue'})).toEqual(null);
      expect(testCollection.first({color: 'green'})).toEqual(null);
    });
    it('can remove one or more items by passing in an array', function () {
      testCollection.add(colors);
      testCollection.remove([{color: 'red', primary: true}, {color: 'blue'}]);
      expect(testCollection.count()).toEqual(2);
      expect(testCollection.first({color: 'red'})).toEqual(null);
      expect(testCollection.first({color: 'blue'})).toEqual(null);
    });
    it('can remove an item by passing in an index', function () {
      testCollection.add(colors);
      testCollection.remove(2);
      expect(testCollection.count()).toEqual(3);
      expect(testCollection.first({color: 'red'})).toBeTruthy();
      expect(testCollection.first({color: 'blue'})).toEqual(null);
    });
    it('returns false when trying to remove an item at an invalid index', function () {
      testCollection.add(colors);
      expect(testCollection.remove(testCollection.count())).toEqual(false);
      expect(testCollection.remove(-1)).toEqual(false);
    });
    it('should replace the old item(s) when trying to add items with duplicated IDs', function () {
      var filtered;
      testCollection.add(colors);
      testCollection.add({ color: 'grey'});
      expect(testCollection.count()).toEqual(5);
      testCollection.add({ id: 1, color: '#f0f0f0'});
      expect(testCollection.count()).toEqual(5);
      filtered = testCollection.filter({id: 1});
      expect(filtered.length).toEqual(1);
      expect(filtered[0].get('color')).toEqual('#f0f0f0');
    });
    it('should not keep items with duplicated IDs when Collection.allowDuplicatedIds flag is false (default)', function () {
      var obj = {id: 4, color: '#efefef', primary: false};
      colors.push(obj, obj);
      testCollection.add(colors);
      expect(testCollection.count()).toEqual(4);
      colors.splice(-3, 2);
      expect(testCollection.toObject().items).toEqual(colors);
    });
    it('should keep items with duplicated IDs if Collection.allowDuplicatedIds flag is set to true', function () {
      var TCollection = Collection.extend({
        allowDuplicatedIds: true
      });
      var items = [{id: 4, color: '#efefef', primary: false}, {id: 3, color: 'transparent', primary: true}];
      var testCollection;
      [].push.apply(colors, items);
      testCollection = new TCollection(colors);
      expect(testCollection.count()).toEqual(colors.length);
      expect(testCollection.toObject().items).toEqual(colors);
    });
  });

});
