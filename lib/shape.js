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

        'visible': true,
        'layer': null,

        'lineWidth': false,
        'lineCap': false,
        'lineJoin': false,
        'miterLimit': false,
        'lineDash': false,
        'lineDashOffset': false,

        'font': false,
        'textAlign': false,
        'textBaseline': false,

        'scale': false,
        'angle': false,
        'translate': false,

        'stroke': false,
        'fill': false,

        'opacity': false,
        'globalCompositeOperation': false,

        'shadowColor': false,
        'shadowOffsetX': false,
        'shadowOffsetY': false,
        'shadowBlur': false
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

    Shape.prototype.isAnimated = function () {
        return this.animationQueue.length === 0;
    };

    Shape.prototype.show = function () {
        this.props.visible = true;
    };

    Shape.prototype.hide = function () {
        this.props.visible = false;
    };

    Shape.prototype.draw = function (ctx, fps) {

        this._runAnimations(ctx, fps);

        var p = this.props;

        if (!p.visible) return;

        // 3. Line styles
        if (p.lineWidth) ctx.lineWidth = p.lineWidth;
        if (p.lineCap) ctx.lineCap = p.lineCap;
        if (p.lineJoin) ctx.lineJoin = p.lineJoin;
        if (p.miterLimit) ctx.miterLimit = p.miterLimit;
        if (p.lineDash) ctx.setLineDash = p.lineDash;
        if (p.lineDashOffset) ctx.lineDashOffset = p.lineDashOffset;

        // 4. Text Styles
        if (p.font) ctx.font = p.font;
        if (p.textAlign) ctx.textAlign = p.textAlign;
        if (p.textBaseline) ctx.textBaseline = p.textBaseline;

        // 6. Transformations
        if (p.scale) {
            p.scale.y = p.scale.y || p.scale.x;
            ctx.scale(p.scale.x, p.scale.y);
        }

        if (p.angle) ctx.rotate(p.angle * (Math.PI/180));
        if (p.translate) ctx.translate(p.translate.x || 0, p.translate.y || 0);

        // 7. Fill and stroke styles
        if (p.stroke) {
            ctx.strokeStyle = p.stroke;
            ctx.stroke();
        }

        if (p.fill) {
            ctx.fillStyle = p.fill;
            ctx.fill();
        }

        // 14. Compositing
        if (p.opacity) ctx.globalAlpha = p.opacity;
        if (p.globalCompositeOperation) ctx.globalCompositeOperation = p.globalCompositeOperation;

        // 15. Shadows
        if (p.shadowColor) ctx.shadowColor = p.shadowColor;
        if (p.shadowOffsetX) ctx.shadowOffsetX = p.shadowOffsetX;
        if (p.shadowOffsetY) ctx.shadowOffsetY = p.shadowOffsetY;
        if (p.shadowBlur) ctx.shadowBlur = p.shadowBlur;
    };

    Shape.prototype.getLayer = function () {

        return (this.props.layer !== null)
            ? Layer.get(this.props.layer)
            : null;
    };

    Shape.prototype.attachTo = function (layer) {

        this.detach();
        layer.addObject(this);
    };

    Shape.prototype.detach = function () {

        var curLayer = this.getLayer();

        if (curLayer !== null) {
            curLayer.removeObject(this);
            this.props.layer = null;
        }
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

            if (typeof this[key] === 'undefined') {
                throw new Error('Property "'+key+'" could not be animated as it does not exist');
            }

            animation.props.push({
                'name': key,
                'newValue': opts.props[key]
            });
        }

        this.animationQueue.push(animation);
    };

    Shape.prototype._runAnimations = function (ctx, fps) {

        // No point in animating an invisible object
        if ( !this.visible || !this.animationQueue.length) {
            // TODO: Set animation properties directly
            return;
        }

        var anim = this.animationQueue[0];
        var easing = util.easings[anim.easing];

        // Bootstrap animation properties
        if (typeof anim.maxIterations === 'undefined') {
            // TODO: Use time diff instead of iterations
            anim.maxIterations = Math.ceil((anim.duration/1000) * fps);

            for (var i=0, k=anim.props.length; i<k; i++) {
                var prop = anim.props[i];
                var curValue = this.props[prop.name];

                prop.orig = curValue;
                prop.delta = prop.newValue - curValue;
            }
        }

        anim.iteration++;

        for (var k=0, l=anim.props.length; k<l; k++) {
            var prop = anim.props[k];

            // http://www.kirupa.com/html5/animating_with_easing_functions_in_javascript.htm
            this[prop.name] = easing(
                anim.iteration, prop.orig, prop.delta, anim.maxIterations
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
