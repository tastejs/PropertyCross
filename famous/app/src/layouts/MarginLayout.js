
define(function(require, exports, module) {
    var Entity = require('famous/core/Entity');
    var Transform = require('famous/core/Transform');
    var OptionsManager = require('famous/core/OptionsManager');
    var RenderNode = require('famous/core/RenderNode');
    var EventHandler = require('famous/core/EventHandler');
    var Transitionable = require('famous/transitions/Transitionable');

    /**
     * A layout which divides a context into sections based on a proportion
     *   of the total sum of margins.  MarginLayout can either lay renderables
     *   out vertically or horizontally.
     * @class MarginLayout
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Transition} [options.transition=false] The transiton that controls the FlexibleLayout instance's reflow.
     * @param {Margins} [options.margins=[]] The proportions for the renderables to maintain
     */
    function MarginLayout(options) {
        this.options = Object.create(MarginLayout.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this.id = Entity.register(this);

        this._margins = new Transitionable(this.options.margins);
        this._nodes = [];

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    MarginLayout.DEFAULT_OPTIONS = {
        margins : [0, 0, 0, 0],
        transition: false
    };
    
    MarginLayout.prototype.add = function add(child) {
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
    MarginLayout.prototype.render = function render() {
        return this.id;
    };

    /**
     * Patches the MarginLayouts instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the MarginLayout instance.
     */
    MarginLayout.prototype.setOptions = function setOptions(options) {
        this.optionsManager.setOptions(options);
    };

    /**
     * Sets the associated margin values for sizing the renderables.
     *
     * @method setMargins
     * @param {Array} margins Array of margins corresponding to the percentage sizes each renderable should be
     */
    MarginLayout.prototype.setMargins = function setMargins(margins, transition, callback) {
        if (transition === undefined) transition = this.options.transition;
        var currMargins = this._margins;
        if (currMargins.get().length === 0) transition = undefined;
        if (currMargins.isActive()) currMargins.halt();
        currMargins.set(margins, transition, callback);
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    MarginLayout.prototype.commit = function commit(context) {
        var parentSize = context.size;
        var parentTransform = context.transform;
        var parentOrigin = context.origin;

        var margins = this._margins.get();
        var size;
        var transform;

        var result = [];
        for (var i = 0; i < this._nodes.length; i++) {
            transform = Transform.translate(margins[0], margins[1]);
            size = [parentSize[0] - margins[0] - margins[2], parentSize[1] - margins[1] - margins[3]];
            result.push({
                transform : transform,
                size: size,
                target : this._nodes[i].render()
            });
        }

        if (parentSize && (parentOrigin[0] !== 0 && parentOrigin[1] !== 0))
            parentTransform = Transform.moveThen([-parentSize[0]*parentOrigin[0], -parentSize[1]*parentOrigin[1], 0], parentTransform);

        return {
            transform: parentTransform,
            size: parentSize,
            target: result
        };
    };

    module.exports = MarginLayout;
});
