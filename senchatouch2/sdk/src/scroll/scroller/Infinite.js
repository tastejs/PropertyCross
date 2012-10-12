/**
 * @private
 */
Ext.define('Ext.scroll.scroller.Infinite', {
    extend: 'Ext.scroll.scroller.CssPosition',

    config: {
        itemLength: 30,

        slicesCount: 6,

        sliceLengthFactor: 1,

        functions: {
            render: Ext.emptyFn,

            recycle: Ext.emptyFn,

            activate: Ext.emptyFn,

            deactivate: Ext.emptyFn,

            scope: null
        },

        direction: 'vertical'
    },

    itemsCountPerSlice: 0,

    sliceLength: 0,

    recycleIndexOffset: 0,

    constructor: function() {
        this.preparedSlices = {};

        this.emptySlices = [];

        this.slices = [];

        this.activeSlices = {
            upper: null,
            lower: null
        };

        return this.callParent(arguments);
    },

    getMaxPosition: function(determine) {
        var maxPosition = this.maxPosition;

        if (determine) {
            maxPosition.x = Infinity;
            maxPosition.y = Infinity;
        }

        return maxPosition;
    },

    getCurrentAxis: function() {
        return (this.getDirection() === 'horizontal') ? 'x' : 'y';
    },

    applyDirection: function(direction) {
        if (direction !== 'vertical' && direction !== 'horizontal') {
            direction = 'vertical';
        }

        return direction;
    },

    applyItemLength: function(length) {
        if (typeof length == 'number' && length > 0) {
            return length;
        }
        //<debug error>
        Ext.Logger.error("Invalid itemLength, must be a number greater than 0");
        //</debug>
    },

    updateItemLength: function(length, oldLength) {
        var containerSize = this.getContainerSize(true),
            sliceLengthFactor = this.getSliceLengthFactor(),
            itemsCountPerSlice,
            width, height, sliceLength;

        if (this.isAxisEnabled('x')) {
            height = containerSize.y;
            itemsCountPerSlice = Math.ceil(containerSize.x / length) * sliceLengthFactor;
            sliceLength = width = itemsCountPerSlice * length;
        }
        else {
            width = containerSize.x;
            itemsCountPerSlice = Math.ceil(containerSize.y / length) * sliceLengthFactor;
            sliceLength = height = itemsCountPerSlice * length;
        }

        this.itemsCountPerSlice = itemsCountPerSlice;
        this.sliceLength = sliceLength;

        this.setSliceSize(width, height);

        if (oldLength) {
            this.refresh();
        }
    },

    applySlicesCount: function(count) {
        if (typeof count == 'number' && count >= 4) {
            return count;
        }
        //<debug error>
        Ext.Logger.error("Invalid slicesCount, must be a number greater or equal to 4");
        //</debug>
    },

    updateSlicesCount: function(count, oldCount) {
        var slices = this.slices,
            emptySlices = this.emptySlices,
            slice, i;

        if (oldCount) {
            this.destroySlices();
        }

        for (i = 0; i < count; i++) {
            slice = this.createSlice();
            slices[i] = slice;
            emptySlices.push(slice);
        }

        this.recycleIndexOffset = Math.floor((count - 2) / 2);

        if (oldCount) {
            this.refresh();
        }
    },

    destroySlices: function() {
        var slices = this.slices,
            i, ln, slice;

        for (i = 0, ln = slices.length; i < ln; i++) {
            slice.destroy();
        }

        slices.length = 0;
        this.emptySlices.length = 0;
        this.preparedSlices.length = 0;
    },

    createSlice: function() {
        var element = this.getElement(),
            slice = element.createChild({}),
            style = slice.dom.style;

        style.position = 'absolute';
//        style.display = 'none';

        return slice;
    },

    setSliceSize: function(width, height) {
        this.getSlicesCount();

        var slices = this.slices,
            i, ln, slice, style;

        width = width + 'px';
        height = height + 'px';

        for (i = 0,ln = slices.length; i < ln; i++) {
            slice = slices[i];

            style = slice.dom.style;
            style.width = width;
            style.height = height;
        }

        return this;
    },

    prepareSlice: function(index) {
        var preparedSlices = this.preparedSlices,
            itemsCountPerSlice = this.itemsCountPerSlice,
            functions = this.getFunctions(),
            startItemIndex, endItemIndex, slice;

        if (!preparedSlices[index]) {
            slice = this.getEmptySlice();
            startItemIndex = index * itemsCountPerSlice;
            endItemIndex = startItemIndex + itemsCountPerSlice - 1;

            preparedSlices[index] = slice;

            functions.render.call(functions.scope, slice, startItemIndex, endItemIndex);
        }

        return preparedSlices[index];
    },

    getSlice: function(index) {
        if (index > 0) {
            this.prepareSlice(index - 1);
        }

        this.prepareSlice(index + 1);

        return this.prepareSlice(index);
    },

    getEmptySlice: function() {
        var recycleIndexOffset = this.recycleIndexOffset,
            upperIndex = this.upperSliceIndex - recycleIndexOffset,
            lowerIndex = this.lowerSliceIndex + recycleIndexOffset,
            preparedSlices = this.preparedSlices,
            emptySlices = this.emptySlices,
            i;

        for (i in preparedSlices) {
            if (preparedSlices.hasOwnProperty(i)) {
                if (i <= upperIndex || i >= lowerIndex) {
                    emptySlices.push(preparedSlices[i]);
                    delete preparedSlices[i];
                }
            }
        }

        return emptySlices.pop();
    },

    setSlicePosition: function(slice, position, axis) {
        var style = slice.dom.style;

        position = (-position) + 'px';

        if (axis === 'x') {
            style.left = position;
        }
        else {
            if (Ext.os.is.iOS || Ext.os.is.Android3) {
                style.webkitTransform = 'translate3d(0px, ' + position + ', 0px)';
            }
            else {
                style.top = position;
            }
        }
    },

    setActiveSlices: function(upper, lower) {
        var activeSlices = this.activeSlices,
            oldUpper = activeSlices.upper,
            oldLower = activeSlices.lower;

        if (oldUpper && oldLower) {
            if (oldUpper !== upper) {
                if (oldUpper !== lower) {
                    this.deactivateSlice(oldUpper);
                }

                if (upper !== oldLower) {
                    this.activateSlice(upper, 2);
                }
            }

            if (oldLower !== lower) {
                if (oldLower !== upper) {
                    this.deactivateSlice(oldLower);
                }

                if (lower !== oldUpper) {
                    this.activateSlice(lower, 1);
                }
            }
        }
        else {
            this.activateSlice(upper, 2);
            this.activateSlice(lower, 1);
        }

        activeSlices.upper = upper;
        activeSlices.lower = lower;

        return this;
    },

    activateSlice: function(slice, zIndex) {
        var functions = this.getFunctions(),
            style = slice.dom.style;

//        style.zIndex = zIndex;
//        style.display = '';

        functions.activate.call(functions.scope, slice);
    },

    deactivateSlice: function(slice) {
        var functions = this.getFunctions(),
            style = slice.dom.style;

//        style.display = 'none';

        if (Ext.os.is.iOS || Ext.os.is.Android3) {
            style.webkitTransform = 'translate3d(0px, -10000px, 0px)';
        }
        else {
            style.top = '-10000px';
        }

//        this.setSlicePosition(slice, 0, this.getCurrentAxis());

        functions.deactivate.call(functions.scope, slice);
    },

    doScrollTo: function(x, y) {
        var axis = this.getCurrentAxis(),
            sliceLength = this.sliceLength,
            upperPosition = ((axis === 'x') ? x : y),
            upperSliceIndex = Math.max(0, Math.floor(upperPosition / this.sliceLength)),
            lowerSliceIndex = upperSliceIndex + 1;

        this.upperSliceIndex = upperSliceIndex;
        this.lowerSliceIndex = lowerSliceIndex;

        var upperSlice = this.getSlice(upperSliceIndex),
            lowerSlice = this.getSlice(lowerSliceIndex),
            containerSize = this.getContainerSize()[axis],
            lowerPosition;

        upperPosition = upperPosition % sliceLength;
        lowerPosition = upperPosition - sliceLength;

        this.setActiveSlices(upperSlice, lowerSlice);

        this.setSlicePosition(upperSlice, upperPosition, axis);

        if (lowerPosition >= -containerSize) {
            this.setSlicePosition(lowerSlice, lowerPosition, axis);
        }
    }
});
