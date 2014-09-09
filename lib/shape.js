module.exports = (function() {

    var extend = require('./util').extend;
    var guid   = require('./util').guid;
    var Layer  = require('./layer');

    function Shape(props) {

        this.id = guid();

        // Attaching getters & setters for more sugar!
        this._attachHelpers(props);
    }

    Shape.prototype._attachHelpers = function (props) {

        this.props = extend({}, this._defaults, props || {});

        var keys = Object.keys(this.props);
        for(var i=0, k=keys.length;i<k; i++) {
            var prop = keys[i];
            this.__defineGetter__(prop, get(prop));
            this.__defineSetter__(prop, set(prop));
        }
    };

    Shape.prototype._defaults ={
        'x': 0,
        'y': 0,
        'opacity': 1,
        'angle': 0,
        'scale': 1,
        'visible': true,
        'layer': null
    };

    // Shape.prototype.prop = function (name, val) {
    //
    //     var hasProp = typeof this.props[name] !== 'undefined';
    //
    //     if (typeof val !== 'undefined') {
    //         if (hasProp)
    //             this.props[name] = val;
    //         else
    //             return false;
    //     }
    //     else {
    //         return hasProp ? this.props[name] : null;
    //     }
    // };

    Shape.prototype.show = function () {
        this.props.visible = true;
    };

    Shape.prototype.hide = function () {
        this.props.visible = false;
    };

    Shape.prototype.draw = function () {};

    Shape.prototype.getLayer = function () {

        return (this.props.layer !== null)
            ? Layer.get(this.props.layer)
            : null;
    };

    // Sugar method
    Shape.prototype.animate = function (opts) {

        if (this.props.layer === null) {
            throw new Error('Cannot animate Shape #'+this.id+' - no associated layer');
        }

        if (typeof opts.easing === 'undefined') {
            opts.easing = 'easeInOutQuad';
        }

        // TODO: Move animation code to Shape object
        this.getLayer().animateObject(this, opts);
    };

    Shape.prototype.stop = function () {
        this.getLayer().stopAnimation(this);
    };

    function get(prop) {

        return function () {
            var hasProp = typeof this.props[prop] !== 'undefined';
            return hasProp ? this.props[prop] : null;
        };
    }

    function set(prop) {

        return function (val) {
            var hasProp = typeof this.props[prop] !== 'undefined';

            if (hasProp) {
                this.props[prop] = val;
            }
        };
    }

    return Shape;
}());
