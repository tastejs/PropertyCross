
define(function(require, exports, module) {
    var Entity = require('famous/core/Entity');
    var Transform = require('famous/core/Transform');
    var OptionsManager = require('famous/core/OptionsManager');
    var RenderNode = require('famous/core/RenderNode');
    var EventHandler = require('famous/core/EventHandler');
    var Transitionable = require('famous/transitions/Transitionable');

    function RatioLayout(options) {
        this.options = Object.create(RatioLayout.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this.id = Entity.register(this);

        this._ratio = new Transitionable(this.options.ratio);
        this._nodes = [];
        this._size = undefined;

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    RatioLayout.DEFAULT_OPTIONS = {
        direction: 0,
        ratio: [1, 1],
        transition: false
    };

    RatioLayout.prototype.add = function add(child) {
        var childNode = (child instanceof RenderNode) ? child : new RenderNode(child);
        this._nodes.push(childNode);
        return childNode;
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {Object} Render spec for this component
     */
    RatioLayout.prototype.render = function render() {
        return this.id;
    };

    /**
     * Patches the RatioLayouts instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the RatioLayout instance.
     */
    RatioLayout.prototype.setOptions = function setOptions(options) {
        this.optionsManager.setOptions(options);
    };

    /**
     * Sets the associated ratio values for sizing the renderables.
     *
     * @method setMargins
     * @param {Array} margins Array of margins corresponding to the percentage sizes each renderable should be
     */
    RatioLayout.prototype.setRatio = function setRatio(ratios, transition, callback) {
        if (transition === undefined) transition = this.options.transition;
        var currRatios = this._ratio;
        if (currRatios.get().length === 0) transition = undefined;
        if (currRatios.isActive()) currRatios.halt();
        currRatios.set(ratios, transition, callback);
    };

    RatioLayout.prototype.getSize = function getSize() { return this._size; }
    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    RatioLayout.prototype.commit = function commit(context) {
        var parentSize = context.size;
        var parentTransform = context.transform;
        var parentOrigin = context.origin;

        var ratio = this._ratio.get();
        var scaleFactor = parentSize[this.options.direction] / ratio[this.options.direction];
        this._size = [ ratio[0] * scaleFactor , ratio[1] * scaleFactor ];

        var result = [];
        for (var i = 0; i < this._nodes.length; i++) {
            result.push({
                size: this._size,
                target : this._nodes[i].render()
            });
        }

        if (parentSize && (parentOrigin[0] !== 0 && parentOrigin[1] !== 0))
            parentTransform = Transform.moveThen([-parentSize[0]*parentOrigin[0], -parentSize[1]*parentOrigin[1], 0], parentTransform);

        return {
            transform: parentTransform,
            size: this._size,
            target: result
        };
    };

    module.exports = RatioLayout;
});
