//@tag foundation,core
//@define Ext.Array
//@require Ext.String

/**
 * @class Ext.Array
 * @singleton
 * @author Jacky Nguyen <jacky@sencha.com>
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 *
 * A set of useful static methods to deal with arrays; provide missing methods for older browsers.
 */
(function() {

    var arrayPrototype = Array.prototype,
        slice = arrayPrototype.slice,
        supportsSplice = function () {
            var array = [],
                lengthBefore,
                j = 20;

            if (!array.splice) {
                return false;
            }

            // This detects a bug in IE8 splice method:
            // see http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/6e946d03-e09f-4b22-a4dd-cd5e276bf05a/

            while (j--) {
                array.push("A");
            }

            array.splice(15, 0, "F", "F", "F", "F", "F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F");

            lengthBefore = array.length; //41
            array.splice(13, 0, "XXX"); // add one element

            if (lengthBefore+1 != array.length) {
                return false;
            }
            // end IE8 bug

            return true;
        }(),
        supportsForEach = 'forEach' in arrayPrototype,
        supportsMap = 'map' in arrayPrototype,
        supportsIndexOf = 'indexOf' in arrayPrototype,
        supportsEvery = 'every' in arrayPrototype,
        supportsSome = 'some' in arrayPrototype,
        supportsFilter = 'filter' in arrayPrototype,
        supportsSort = function() {
            var a = [1,2,3,4,5].sort(function(){ return 0; });
            return a[0] === 1 && a[1] === 2 && a[2] === 3 && a[3] === 4 && a[4] === 5;
        }(),
        supportsSliceOnNodeList = true,
        ExtArray;

    try {
        // IE 6 - 8 will throw an error when using Array.prototype.slice on NodeList
        if (typeof document !== 'undefined') {
            slice.call(document.getElementsByTagName('body'));
        }
    } catch (e) {
        supportsSliceOnNodeList = false;
    }

    function fixArrayIndex (array, index) {
        return (index < 0) ? Math.max(0, array.length + index)
                           : Math.min(array.length, index);
    }

    /*
    Does the same work as splice, but with a slightly more convenient signature. The splice
    method has bugs in IE8, so this is the implementation we use on that platform.

    The rippling of items in the array can be tricky. Consider two use cases:

                  index=2
                  removeCount=2
                 /=====\
        +---+---+---+---+---+---+---+---+
        | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
        +---+---+---+---+---+---+---+---+
                         /  \/  \/  \/  \
                        /   /\  /\  /\   \
                       /   /  \/  \/  \   +--------------------------+
                      /   /   /\  /\   +--------------------------+   \
                     /   /   /  \/  +--------------------------+   \   \
                    /   /   /   /+--------------------------+   \   \   \
                   /   /   /   /                             \   \   \   \
                  v   v   v   v                               v   v   v   v
        +---+---+---+---+---+---+       +---+---+---+---+---+---+---+---+---+
        | 0 | 1 | 4 | 5 | 6 | 7 |       | 0 | 1 | a | b | c | 4 | 5 | 6 | 7 |
        +---+---+---+---+---+---+       +---+---+---+---+---+---+---+---+---+
        A                               B        \=========/
                                                 insert=[a,b,c]

    In case A, it is obvious that copying of [4,5,6,7] must be left-to-right so
    that we don't end up with [0,1,6,7,6,7]. In case B, we have the opposite; we
    must go right-to-left or else we would end up with [0,1,a,b,c,4,4,4,4].
    */
    function replaceSim (array, index, removeCount, insert) {
        var add = insert ? insert.length : 0,
            length = array.length,
            pos = fixArrayIndex(array, index);

        // we try to use Array.push when we can for efficiency...
        if (pos === length) {
            if (add) {
                array.push.apply(array, insert);
            }
        } else {
            var remove = Math.min(removeCount, length - pos),
                tailOldPos = pos + remove,
                tailNewPos = tailOldPos + add - remove,
                tailCount = length - tailOldPos,
                lengthAfterRemove = length - remove,
                i;

            if (tailNewPos < tailOldPos) { // case A
                for (i = 0; i < tailCount; ++i) {
                    array[tailNewPos+i] = array[tailOldPos+i];
                }
            } else if (tailNewPos > tailOldPos) { // case B
                for (i = tailCount; i--; ) {
                    array[tailNewPos+i] = array[tailOldPos+i];
                }
            } // else, add == remove (nothing to do)

            if (add && pos === lengthAfterRemove) {
                array.length = lengthAfterRemove; // truncate array
                array.push.apply(array, insert);
            } else {
                array.length = lengthAfterRemove + add; // reserves space
                for (i = 0; i < add; ++i) {
                    array[pos+i] = insert[i];
                }
            }
        }

        return array;
    }

    function replaceNative (array, index, removeCount, insert) {
        if (insert && insert.length) {
            if (index < array.length) {
                array.splice.apply(array, [index, removeCount].concat(insert));
            } else {
                array.push.apply(array, insert);
            }
        } else {
            array.splice(index, removeCount);
        }
        return array;
    }

    function eraseSim (array, index, removeCount) {
        return replaceSim(array, index, removeCount);
    }

    function eraseNative (array, index, removeCount) {
        array.splice(index, removeCount);
        return array;
    }

    function spliceSim (array, index, removeCount) {
        var pos = fixArrayIndex(array, index),
            removed = array.slice(index, fixArrayIndex(array, pos+removeCount));

        if (arguments.length < 4) {
            replaceSim(array, pos, removeCount);
        } else {
            replaceSim(array, pos, removeCount, slice.call(arguments, 3));
        }

        return removed;
    }

    function spliceNative (array) {
        return array.splice.apply(array, slice.call(arguments, 1));
    }

    var erase = supportsSplice ? eraseNative : eraseSim,
        replace = supportsSplice ? replaceNative : replaceSim,
        splice = supportsSplice ? spliceNative : spliceSim;

    // NOTE: from here on, use erase, replace or splice (not native methods)...
    ExtArray = Ext.Array = {
        /**
         * Iterates an array or an iterable value and invoke the given callback function for each item.
         *
         *     var countries = ['Vietnam', 'Singapore', 'United States', 'Russia'];
         *
         *     Ext.Array.each(countries, function(name, index, countriesItSelf) {
         *         console.log(name);
         *     });
         *
         *     var sum = function() {
         *         var sum = 0;
         *
         *         Ext.Array.each(arguments, function(value) {
         *             sum += value;
         *         });
         *
         *         return sum;
         *     };
         *
         *     sum(1, 2, 3); // returns 6
         *
         * The iteration can be stopped by returning false in the function callback.
         *
         *     Ext.Array.each(countries, function(name, index, countriesItSelf) {
         *         if (name === 'Singapore') {
         *             return false; // break here
         *         }
         *     });
         *
         * {@link Ext#each Ext.each} is alias for {@link Ext.Array#each Ext.Array.each}
         *
         * @param {Array/NodeList/Object} iterable The value to be iterated. If this
         * argument is not iterable, the callback function is called once.
         * @param {Function} fn The callback function. If it returns `false`, the iteration stops and this method returns
         * the current `index`.
         * @param {Object} fn.item The item at the current `index` in the passed `array`
         * @param {Number} fn.index The current `index` within the `array`
         * @param {Array} fn.allItems The `array` itself which was passed as the first argument
         * @param {Boolean} fn.return Return false to stop iteration.
         * @param {Object} scope (Optional) The scope (`this` reference) in which the specified function is executed.
         * @param {Boolean} [reverse=false] (Optional) Reverse the iteration order (loop from the end to the beginning).
         * @return {Boolean} See description for the `fn` parameter.
         */
        each: function(array, fn, scope, reverse) {
            array = ExtArray.from(array);

            var i,
                ln = array.length;

            if (reverse !== true) {
                for (i = 0; i < ln; i++) {
                    if (fn.call(scope || array[i], array[i], i, array) === false) {
                        return i;
                    }
                }
            }
            else {
                for (i = ln - 1; i > -1; i--) {
                    if (fn.call(scope || array[i], array[i], i, array) === false) {
                        return i;
                    }
                }
            }

            return true;
        },

        /**
         * Iterates an array and invoke the given callback function for each item. Note that this will simply
         * delegate to the native `Array.prototype.forEach` method if supported. It doesn't support stopping the
         * iteration by returning `false` in the callback function like {@link Ext.Array#each}. However, performance
         * could be much better in modern browsers comparing with {@link Ext.Array#each}
         *
         * @param {Array} array The array to iterate.
         * @param {Function} fn The callback function.
         * @param {Object} fn.item The item at the current `index` in the passed `array`.
         * @param {Number} fn.index The current `index` within the `array`.
         * @param {Array}  fn.allItems The `array` itself which was passed as the first argument.
         * @param {Object} scope (Optional) The execution scope (`this`) in which the specified function is executed.
         */
        forEach: supportsForEach ? function(array, fn, scope) {
                return array.forEach(fn, scope);
        } : function(array, fn, scope) {
            var i = 0,
                ln = array.length;

            for (; i < ln; i++) {
                fn.call(scope, array[i], i, array);
            }
        },

        /**
         * Get the index of the provided `item` in the given `array`, a supplement for the
         * missing arrayPrototype.indexOf in Internet Explorer.
         *
         * @param {Array} array The array to check.
         * @param {Object} item The item to look for.
         * @param {Number} from (Optional) The index at which to begin the search.
         * @return {Number} The index of item in the array (or -1 if it is not found).
         */
        indexOf: (supportsIndexOf) ? function(array, item, from) {
            return array.indexOf(item, from);
        } : function(array, item, from) {
            var i, length = array.length;

            for (i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++) {
                if (array[i] === item) {
                    return i;
                }
            }

            return -1;
        },

        /**
         * Checks whether or not the given `array` contains the specified `item`.
         *
         * @param {Array} array The array to check.
         * @param {Object} item The item to look for.
         * @return {Boolean} `true` if the array contains the item, `false` otherwise.
         */
        contains: supportsIndexOf ? function(array, item) {
            return array.indexOf(item) !== -1;
        } : function(array, item) {
            var i, ln;

            for (i = 0, ln = array.length; i < ln; i++) {
                if (array[i] === item) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Converts any iterable (numeric indices and a length property) into a true array.
         *
         *     function test() {
         *         var args = Ext.Array.toArray(arguments),
         *             fromSecondToLastArgs = Ext.Array.toArray(arguments, 1);
         *
         *         alert(args.join(' '));
         *         alert(fromSecondToLastArgs.join(' '));
         *     }
         *
         *     test('just', 'testing', 'here'); // alerts 'just testing here';
         *                                      // alerts 'testing here';
         *
         *     Ext.Array.toArray(document.getElementsByTagName('div')); // will convert the NodeList into an array
         *     Ext.Array.toArray('splitted'); // returns ['s', 'p', 'l', 'i', 't', 't', 'e', 'd']
         *     Ext.Array.toArray('splitted', 0, 3); // returns ['s', 'p', 'l', 'i']
         *
         * {@link Ext#toArray Ext.toArray} is alias for {@link Ext.Array#toArray Ext.Array.toArray}
         *
         * @param {Object} iterable the iterable object to be turned into a true Array.
         * @param {Number} [start=0] (Optional) a zero-based index that specifies the start of extraction.
         * @param {Number} [end=-1] (Optional) a zero-based index that specifies the end of extraction.
         * @return {Array}
         */
        toArray: function(iterable, start, end){
            if (!iterable || !iterable.length) {
                return [];
            }

            if (typeof iterable === 'string') {
                iterable = iterable.split('');
            }

            if (supportsSliceOnNodeList) {
                return slice.call(iterable, start || 0, end || iterable.length);
            }

            var array = [],
                i;

            start = start || 0;
            end = end ? ((end < 0) ? iterable.length + end : end) : iterable.length;

            for (i = start; i < end; i++) {
                array.push(iterable[i]);
            }

            return array;
        },

        /**
         * Plucks the value of a property from each item in the Array. Example:
         *
         *     Ext.Array.pluck(Ext.query("p"), "className"); // [el1.className, el2.className, ..., elN.className]
         *
         * @param {Array/NodeList} array The Array of items to pluck the value from.
         * @param {String} propertyName The property name to pluck from each element.
         * @return {Array} The value from each item in the Array.
         */
        pluck: function(array, propertyName) {
            var ret = [],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                ret.push(item[propertyName]);
            }

            return ret;
        },

        /**
         * Creates a new array with the results of calling a provided function on every element in this array.
         *
         * @param {Array} array
         * @param {Function} fn Callback function for each item.
         * @param {Object} scope Callback function scope.
         * @return {Array} results
         */
        map: supportsMap ? function(array, fn, scope) {
            return array.map(fn, scope);
        } : function(array, fn, scope) {
            var results = [],
                i = 0,
                len = array.length;

            for (; i < len; i++) {
                results[i] = fn.call(scope, array[i], i, array);
            }

            return results;
        },

        /**
         * Executes the specified function for each array element until the function returns a falsy value.
         * If such an item is found, the function will return `false` immediately.
         * Otherwise, it will return `true`.
         *
         * @param {Array} array
         * @param {Function} fn Callback function for each item.
         * @param {Object} scope Callback function scope.
         * @return {Boolean} `true` if no `false` value is returned by the callback function.
         */
        every: function(array, fn, scope) {
            //<debug>
            if (!fn) {
                Ext.Error.raise('Ext.Array.every must have a callback function passed as second argument.');
            }
            //</debug>
            if (supportsEvery) {
                return array.every(fn, scope);
            }

            var i = 0,
                ln = array.length;

            for (; i < ln; ++i) {
                if (!fn.call(scope, array[i], i, array)) {
                    return false;
                }
            }

            return true;
        },

        /**
         * Executes the specified function for each array element until the function returns a truthy value.
         * If such an item is found, the function will return `true` immediately. Otherwise, it will return `false`.
         *
         * @param {Array} array
         * @param {Function} fn Callback function for each item.
         * @param {Object} scope Callback function scope.
         * @return {Boolean} `true` if the callback function returns a truthy value.
         */
        some: function(array, fn, scope) {
            //<debug>
            if (!fn) {
                Ext.Error.raise('Ext.Array.some must have a callback function passed as second argument.');
            }
            //</debug>
            if (supportsSome) {
                return array.some(fn, scope);
            }

            var i = 0,
                ln = array.length;

            for (; i < ln; ++i) {
                if (fn.call(scope, array[i], i, array)) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Filter through an array and remove empty item as defined in {@link Ext#isEmpty Ext.isEmpty}.
         *
         * See {@link Ext.Array#filter}
         *
         * @param {Array} array
         * @return {Array} results
         */
        clean: function(array) {
            var results = [],
                i = 0,
                ln = array.length,
                item;

            for (; i < ln; i++) {
                item = array[i];

                if (!Ext.isEmpty(item)) {
                    results.push(item);
                }
            }

            return results;
        },

        /**
         * Returns a new array with unique items.
         *
         * @param {Array} array
         * @return {Array} results
         */
        unique: function(array) {
            var clone = [],
                i = 0,
                ln = array.length,
                item;

            for (; i < ln; i++) {
                item = array[i];

                if (ExtArray.indexOf(clone, item) === -1) {
                    clone.push(item);
                }
            }

            return clone;
        },

        /**
         * Creates a new array with all of the elements of this array for which
         * the provided filtering function returns `true`.
         *
         * @param {Array} array
         * @param {Function} fn Callback function for each item.
         * @param {Object} scope Callback function scope.
         * @return {Array} results
         */
        filter: function(array, fn, scope) {
            if (supportsFilter) {
                return array.filter(fn, scope);
            }

            var results = [],
                i = 0,
                ln = array.length;

            for (; i < ln; i++) {
                if (fn.call(scope, array[i], i, array)) {
                    results.push(array[i]);
                }
            }

            return results;
        },

        /**
         * Converts a value to an array if it's not already an array; returns:
         *
         * - An empty array if given value is `undefined` or `null`
         * - Itself if given value is already an array
         * - An array copy if given value is {@link Ext#isIterable iterable} (arguments, NodeList and alike)
         * - An array with one item which is the given value, otherwise
         *
         * @param {Object} value The value to convert to an array if it's not already is an array.
         * @param {Boolean} [newReference=false] (Optional) `true` to clone the given array and return a new reference if necessary.
         * @return {Array} array
         */
        from: function(value, newReference) {
            if (value === undefined || value === null) {
                return [];
            }

            if (Ext.isArray(value)) {
                return (newReference) ? slice.call(value) : value;
            }

            if (value && value.length !== undefined && typeof value !== 'string') {
                return ExtArray.toArray(value);
            }

            return [value];
        },

        /**
         * Removes the specified item from the array if it exists.
         *
         * @param {Array} array The array.
         * @param {Object} item The item to remove.
         * @return {Array} The passed array itself.
         */
        remove: function(array, item) {
            var index = ExtArray.indexOf(array, item);

            if (index !== -1) {
                erase(array, index, 1);
            }

            return array;
        },

        /**
         * Push an item into the array only if the array doesn't contain it yet.
         *
         * @param {Array} array The array.
         * @param {Object} item The item to include.
         */
        include: function(array, item) {
            if (!ExtArray.contains(array, item)) {
                array.push(item);
            }
        },

        /**
         * Clone a flat array without referencing the previous one. Note that this is different
         * from `Ext.clone` since it doesn't handle recursive cloning. It's simply a convenient, easy-to-remember method
         * for `Array.prototype.slice.call(array)`.
         *
         * @param {Array} array The array
         * @return {Array} The clone array
         */
        clone: function(array) {
            return slice.call(array);
        },

        /**
         * Merge multiple arrays into one with unique items.
         *
         * {@link Ext.Array#union} is alias for {@link Ext.Array#merge}
         *
         * @param {Array} array1
         * @param {Array} array2
         * @param {Array} etc
         * @return {Array} merged
         */
        merge: function() {
            var args = slice.call(arguments),
                array = [],
                i, ln;

            for (i = 0, ln = args.length; i < ln; i++) {
                array = array.concat(args[i]);
            }

            return ExtArray.unique(array);
        },

        /**
         * Merge multiple arrays into one with unique items that exist in all of the arrays.
         *
         * @param {Array} array1
         * @param {Array} array2
         * @param {Array} etc
         * @return {Array} intersect
         */
        intersect: function() {
            var intersect = [],
                arrays = slice.call(arguments),
                item, minArray, itemIndex, arrayIndex;

            if (!arrays.length) {
                return intersect;
            }

            //Find the Smallest Array
            arrays = arrays.sort(function(a, b) {
                if (a.length > b.length) {
                    return 1;
                } else if (a.length < b.length) {
                    return -1;
                } else {
                    return 0;
                }
            });

            //Remove duplicates from smallest array
            minArray = ExtArray.unique(arrays[0]);

            //Populate intersecting values
            for (itemIndex = 0; itemIndex < minArray.length; itemIndex++) {
                item = minArray[itemIndex];
                for (arrayIndex = 1; arrayIndex < arrays.length; arrayIndex++) {
                    if (arrays[arrayIndex].indexOf(item) === -1) {
                        break;
                    }

                    if (arrayIndex == (arrays.length - 1)) {
                        intersect.push(item);
                    }
                }
            }

            return intersect;
        },

        /**
         * Perform a set difference A-B by subtracting all items in array B from array A.
         *
         * @param {Array} arrayA
         * @param {Array} arrayB
         * @return {Array} difference
         */
        difference: function(arrayA, arrayB) {
            var clone = slice.call(arrayA),
                ln = clone.length,
                i, j, lnB;

            for (i = 0,lnB = arrayB.length; i < lnB; i++) {
                for (j = 0; j < ln; j++) {
                    if (clone[j] === arrayB[i]) {
                        erase(clone, j, 1);
                        j--;
                        ln--;
                    }
                }
            }

            return clone;
        },

        /**
         * Returns a shallow copy of a part of an array. This is equivalent to the native
         * call `Array.prototype.slice.call(array, begin, end)`. This is often used when "array"
         * is "arguments" since the arguments object does not supply a slice method but can
         * be the context object to `Array.prototype.slice()`.
         *
         * @param {Array} array The array (or arguments object).
         * @param {Number} begin The index at which to begin. Negative values are offsets from
         * the end of the array.
         * @param {Number} end The index at which to end. The copied items do not include
         * end. Negative values are offsets from the end of the array. If end is omitted,
         * all items up to the end of the array are copied.
         * @return {Array} The copied piece of the array.
         */
        slice: function(array, begin, end) {
            return slice.call(array, begin, end);
        },

        /**
         * Sorts the elements of an Array.
         * By default, this method sorts the elements alphabetically and ascending.
         *
         * @param {Array} array The array to sort.
         * @param {Function} sortFn (optional) The comparison function.
         * @return {Array} The sorted array.
         */
        sort: function(array, sortFn) {
            if (supportsSort) {
                if (sortFn) {
                    return array.sort(sortFn);
                } else {
                    return array.sort();
                }
            }

            var length = array.length,
                i = 0,
                comparison,
                j, min, tmp;

            for (; i < length; i++) {
                min = i;
                for (j = i + 1; j < length; j++) {
                    if (sortFn) {
                        comparison = sortFn(array[j], array[min]);
                        if (comparison < 0) {
                            min = j;
                        }
                    } else if (array[j] < array[min]) {
                        min = j;
                    }
                }
                if (min !== i) {
                    tmp = array[i];
                    array[i] = array[min];
                    array[min] = tmp;
                }
            }

            return array;
        },

        /**
         * Recursively flattens into 1-d Array. Injects Arrays inline.
         *
         * @param {Array} array The array to flatten
         * @return {Array} The 1-d array.
         */
        flatten: function(array) {
            var worker = [];

            function rFlatten(a) {
                var i, ln, v;

                for (i = 0, ln = a.length; i < ln; i++) {
                    v = a[i];

                    if (Ext.isArray(v)) {
                        rFlatten(v);
                    } else {
                        worker.push(v);
                    }
                }

                return worker;
            }

            return rFlatten(array);
        },

        /**
         * Returns the minimum value in the Array.
         *
         * @param {Array/NodeList} array The Array from which to select the minimum value.
         * @param {Function} comparisonFn (optional) a function to perform the comparison which determines minimization.
         * If omitted the "<" operator will be used.
         * __Note:__ gt = 1; eq = 0; lt = -1
         * @return {Object} minValue The minimum value.
         */
        min: function(array, comparisonFn) {
            var min = array[0],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                if (comparisonFn) {
                    if (comparisonFn(min, item) === 1) {
                        min = item;
                    }
                }
                else {
                    if (item < min) {
                        min = item;
                    }
                }
            }

            return min;
        },

        /**
         * Returns the maximum value in the Array.
         *
         * @param {Array/NodeList} array The Array from which to select the maximum value.
         * @param {Function} comparisonFn (optional) a function to perform the comparison which determines maximization.
         * If omitted the ">" operator will be used.
         * __Note:__ gt = 1; eq = 0; lt = -1
         * @return {Object} maxValue The maximum value
         */
        max: function(array, comparisonFn) {
            var max = array[0],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                if (comparisonFn) {
                    if (comparisonFn(max, item) === -1) {
                        max = item;
                    }
                }
                else {
                    if (item > max) {
                        max = item;
                    }
                }
            }

            return max;
        },

        /**
         * Calculates the mean of all items in the array.
         *
         * @param {Array} array The Array to calculate the mean value of.
         * @return {Number} The mean.
         */
        mean: function(array) {
            return array.length > 0 ? ExtArray.sum(array) / array.length : undefined;
        },

        /**
         * Calculates the sum of all items in the given array.
         *
         * @param {Array} array The Array to calculate the sum value of.
         * @return {Number} The sum.
         */
        sum: function(array) {
            var sum = 0,
                i, ln, item;

            for (i = 0,ln = array.length; i < ln; i++) {
                item = array[i];

                sum += item;
            }

            return sum;
        },

        //<debug>
        _replaceSim: replaceSim, // for unit testing
        _spliceSim: spliceSim,
        //</debug>

        /**
         * Removes items from an array. This is functionally equivalent to the splice method
         * of Array, but works around bugs in IE8's splice method and does not copy the
         * removed elements in order to return them (because very often they are ignored).
         *
         * @param {Array} array The Array on which to replace.
         * @param {Number} index The index in the array at which to operate.
         * @param {Number} removeCount The number of items to remove at index.
         * @return {Array} The array passed.
         * @method
         */
        erase: erase,

        /**
         * Inserts items in to an array.
         *
         * @param {Array} array The Array on which to replace.
         * @param {Number} index The index in the array at which to operate.
         * @param {Array} items The array of items to insert at index.
         * @return {Array} The array passed.
         */
        insert: function (array, index, items) {
            return replace(array, index, 0, items);
        },

        /**
         * Replaces items in an array. This is functionally equivalent to the splice method
         * of Array, but works around bugs in IE8's splice method and is often more convenient
         * to call because it accepts an array of items to insert rather than use a variadic
         * argument list.
         *
         * @param {Array} array The Array on which to replace.
         * @param {Number} index The index in the array at which to operate.
         * @param {Number} removeCount The number of items to remove at index (can be 0).
         * @param {Array} insert (optional) An array of items to insert at index.
         * @return {Array} The array passed.
         * @method
         */
        replace: replace,

        /**
         * Replaces items in an array. This is equivalent to the splice method of Array, but
         * works around bugs in IE8's splice method. The signature is exactly the same as the
         * splice method except that the array is the first argument. All arguments following
         * removeCount are inserted in the array at index.
         *
         * @param {Array} array The Array on which to replace.
         * @param {Number} index The index in the array at which to operate.
         * @param {Number} removeCount The number of items to remove at index (can be 0).
         * @return {Array} An array containing the removed items.
         * @method
         */
        splice: splice
    };

    /**
     * @method
     * @member Ext
     * @alias Ext.Array#each
     */
    Ext.each = ExtArray.each;

    /**
     * @method
     * @member Ext.Array
     * @alias Ext.Array#merge
     */
    ExtArray.union = ExtArray.merge;

    /**
     * Old alias to {@link Ext.Array#min}
     * @deprecated 4.0.0 Please use {@link Ext.Array#min} instead
     * @method
     * @member Ext
     * @alias Ext.Array#min
     */
    Ext.min = ExtArray.min;

    /**
     * Old alias to {@link Ext.Array#max}
     * @deprecated 4.0.0 Please use {@link Ext.Array#max} instead
     * @method
     * @member Ext
     * @alias Ext.Array#max
     */
    Ext.max = ExtArray.max;

    /**
     * Old alias to {@link Ext.Array#sum}
     * @deprecated 4.0.0 Please use {@link Ext.Array#sum} instead
     * @method
     * @member Ext
     * @alias Ext.Array#sum
     */
    Ext.sum = ExtArray.sum;

    /**
     * Old alias to {@link Ext.Array#mean}
     * @deprecated 4.0.0 Please use {@link Ext.Array#mean} instead
     * @method
     * @member Ext
     * @alias Ext.Array#mean
     */
    Ext.mean = ExtArray.mean;

    /**
     * Old alias to {@link Ext.Array#flatten}
     * @deprecated 4.0.0 Please use {@link Ext.Array#flatten} instead
     * @method
     * @member Ext
     * @alias Ext.Array#flatten
     */
    Ext.flatten = ExtArray.flatten;

    /**
     * Old alias to {@link Ext.Array#clean}
     * @deprecated 4.0.0 Please use {@link Ext.Array#clean} instead
     * @method
     * @member Ext
     * @alias Ext.Array#clean
     */
    Ext.clean = ExtArray.clean;

    /**
     * Old alias to {@link Ext.Array#unique}
     * @deprecated 4.0.0 Please use {@link Ext.Array#unique} instead
     * @method
     * @member Ext
     * @alias Ext.Array#unique
     */
    Ext.unique = ExtArray.unique;

    /**
     * Old alias to {@link Ext.Array#pluck Ext.Array.pluck}
     * @deprecated 4.0.0 Please use {@link Ext.Array#pluck Ext.Array.pluck} instead
     * @method
     * @member Ext
     * @alias Ext.Array#pluck
     */
    Ext.pluck = ExtArray.pluck;

    /**
     * @method
     * @member Ext
     * @alias Ext.Array#toArray
     */
    Ext.toArray = function() {
        return ExtArray.toArray.apply(ExtArray, arguments);
    };
})();
