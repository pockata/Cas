module.exports = (function () {

    // Holds all layers
    var layerMap = [];
    var easings = require('./util').easings;
    var guid = require('./util').guid;

    function Layer() {

        this.id = guid();
        this.visible = true;
        this.objects = [];

        this.animationQueue = {};

        layerMap.push(this);

        this.offsetX = 0;
        this.offsetY = 0;
    }

    Layer.prototype.addObject = function (obj) {
        obj.layer = this.id;
        this.objects.push(obj);
    };

    Layer.prototype.removeObject = function (id) {
        // body...
    };

    Layer.prototype.draw = function (ctx, fps) {

        this._runAnimations(ctx, fps);

        for (var i=0,k=this.objects.length; i<k; i++) {

            var obj = this.objects[i];
            if (obj.visible) {
                obj.draw(ctx);
            }
        }
    };

    Layer.prototype.moveToTop = function () {
        this._removeFromLayerMap();
        layerMap.push(this);
    };

    Layer.prototype.moveToBottom = function () {
        this._removeFromLayerMap();
        layerMap.unshift(this);
    };

    Layer.prototype.moveToIndex = function (index) {
        this._removeFromLayerMap();
        layerMap.splice(index, 0, this);
    };

    Layer.prototype._removeFromLayerMap = function (obj) {

        var mapIndex = this.objects.indexOf(obj);

        if (mapIndex === -1) {
            throw new Error('Layer not present in layer map');
        }

        this.objects.splice(mapIndex, 1);
    };

    Layer.prototype.moveObjectToTop = function (obj) {
        this._removeFromLayerMap();
        this.objects.push(obj);
    };

    Layer.prototype.moveObjectToBottom = function (obj) {
        this._removeFromLayerMap();
        this.objects.unshift(obj);
    };

    Layer.prototype.moveObjectToIndex = function (obj, index) {
        this._removeFromLayerMap();
        this.objects.splice(index, 0, obj);
    };

    Layer.prototype._removeObjectFromMap = function () {

        var mapIndex = this.objects.indexOf(this);

        if (mapIndex === -1) {
            throw new Error('Layer not present in layer map');
        }

        this.objects.splice(mapIndex, 1);
    };

    Layer.prototype.animateObject = function (obj, opts) {

        if (!opts.props || !opts.duration) {
            throw new Error('Missing arguments. Animation requires properties and duration');
        }

        if (typeof this.animationQueue[obj.id] === 'undefined') {
            this.animationQueue[obj.id] = {
                'ref': obj,
                'animations': []
            };
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

            if (typeof obj[key] === 'undefined') {
                throw new Error('Property "'+key+'" could not be animated as it does not exist');
            }

            animation.props.push({
                'name': key,
                'delta': prop - obj[key],
                'orig': obj[key],
            });
        }

        this.animationQueue[obj.id].animations.push(animation);
    };

    Layer.prototype._runAnimations = function (ctx, fps) {

        var keys = Object.keys(this.animationQueue);

        for (var i=0, j=keys.length; i<j; i++) {

            var object = this.animationQueue[keys[i]];

            // No point in animating an invisible object
            if ( !object.ref.visible || !object.animations.length) {
                continue;
            }

            var anim = object.animations[0];
            var easing = easings[anim.easing];
            var prop;

            if ( !anim.startTime) {
                anim.startTime = Date.now();
                anim.maxIterations = Math.ceil((anim.duration/1000) * fps);
            }

            for (var k=0, l=anim.props.length; k<l; k++) {

                prop = anim.props[k];

                // http://www.kirupa.com/html5/animating_with_easing_functions_in_javascript.htm
                object.ref[prop.name] = easing(
                    ++anim.iteration, prop.orig, prop.delta, anim.maxIterations
                );
            }

            if (anim.iteration === anim.maxIterations) {

                if (anim.onComplete !== null) {
                    anim.onComplete();
                }

                object.animations.shift();
            }
        }
    };

    Layer.prototype.stopAnimation = function (obj) {

        if (typeof this.animationQueue[obj.id] !== 'undefined') {
            this.animationQueue[obj.id].animations = [];
        }
    };

    var publicApi = {
        'deleteAll': function () {
            layerMap = [];
        },
        'getAll': function () {
            return layerMap;
        },
        'getLayerById': function (id) {

            for (var i=0,k=layerMap.length; i<k; i++) {
                if (layerMap[i].id === id) {
                    return layerMap[i];
                }
            }

            return null;
        },
        'getLayerByIndex': function (index) {
            return typeof layerMap[index] !== 'undefined'
                ? layerMap[index]
                : null;
        },
        'get': function (id) {

            for(var i=0, k=layerMap.length; i<k; i++) {
                if (layerMap[i].id === id) {
                    return layerMap[i];
                }
            }

            return null;
        }
    };


    publicApi.Layer = Layer;

    return publicApi;
})();
