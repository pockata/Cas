module.exports = (function() {

    var util   = require('./util');
    var Layer  = require('./layer');

    function Shape(props) {

        this.id = util.guid();

        this.animationQueue = [];

        // Attaching getters & setters for more sugar!
        this._attachHelpers(props);
    }

    Shape.prototype._attachHelpers = function (props) {

        this.props = util.extend({}, this._defaults, props || {});

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

    Shape.prototype.draw = function (ctx, fps) {
        this._runAnimations(ctx, fps);
    };

    Shape.prototype.getLayer = function () {

        return (this.props.layer !== null)
            ? Layer.get(this.props.layer)
            : null;
    };

    // Sugar method
    Shape.prototype.animate = function (opts) {

        if (!opts.props || !opts.duration) {
            throw new Error('Missing arguments. Animation requires properties and duration');
        }

        if (typeof opts.easing === 'undefined') {
            opts.easing = 'easeInOutQuad';
        }

        var animation = {
            'props': [],
            'duration': opts.duration,
            'easing': opts.easing,
            'onComplete': opts.onComplete || null,
            'iteration': 0
        };

        var keys = Object.keys(opts.props);
        for (var i=0, k=keys.length; i<k; i++) {

            var key = keys[i];
            var prop = opts.props[key];

            if (typeof this[key] === 'undefined') {
                throw new Error('Property "'+key+'" could not be animated as it does not exist');
            }

            animation.props.push({
                'name': key,
                'delta': prop - this[key],
                'orig': this[key],
            });
        }

        this.animationQueue.push(animation);
    };

    Shape.prototype._runAnimations = function (ctx, fps) {

        // No point in animating an invisible object
        if ( !this.visible || !this.animationQueue.length) {
            return;
        }

        var anim = this.animationQueue[0];

        var easing = util.easings[anim.easing];
        var prop;

        if (typeof anim.maxIterations === 'undefined') {
            anim.maxIterations = Math.ceil((anim.duration/1000) * fps);
        }

        for (var k=0, l=anim.props.length; k<l; k++) {

            prop = anim.props[k];

            // http://www.kirupa.com/html5/animating_with_easing_functions_in_javascript.htm
            this[prop.name] = easing(
                ++anim.iteration, prop.orig, prop.delta, anim.maxIterations
            );
        }
        if (anim.iteration === anim.maxIterations) {

            if (anim.onComplete !== null) {
                anim.onComplete();
            }

            this.animationQueue.shift();
        }
    };

    Shape.prototype.stop = function () {
        this.animationQueue = [];
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
