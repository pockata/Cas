module.exports = (function () {

    // Holds all layers
    var layerMap = [];
    var util = require('./util');

    function Layer() {

        this.id = util.guid();
        this.visible = true;
        this.objects = [];

        layerMap.push(this);

        this.offsetX = 0;
        this.offsetY = 0;
    }

    Layer.prototype.draw = function (ctx, fps) {

        for (var i=0,k=this.objects.length; i<k; i++) {

            var obj = this.objects[i];
            if (obj.visible) {
                obj.draw(ctx, fps);
            }
        }
    };

    Layer.prototype.moveToTop = function () {
        this.removeFromLayerMap();
        layerMap.push(this);
    };

    Layer.prototype.moveToBottom = function () {
        this.removeFromLayerMap();
        layerMap.unshift(this);
    };

    Layer.prototype.moveToIndex = function (index) {
        this.removeFromLayerMap();
        layerMap.splice(index, 0, this);
    };

    Layer.prototype.removeFromLayerMap = function () {
        Layer.remove(this);
    };

    Layer.prototype.addObject = function (obj) {
        obj.layer = this.id;
        this.objects.push(obj);
    };

    Layer.prototype.moveObjectToTop = function (obj) {
        this.removeObject(obj);
        this.objects.push(obj);
    };

    Layer.prototype.moveObjectToBottom = function (obj) {
        this.removeObject(obj);
        this.objects.unshift(obj);
    };

    Layer.prototype.moveObjectToIndex = function (obj, index) {
        this.removeObject(obj);
        this.objects.splice(index, 0, obj);
    };

    Layer.prototype.removeObject = function (obj) {

        var mapIndex = this.objects.indexOf(obj);

        if (mapIndex === -1) {
            throw new Error('Layer not present in layer map');
        }

        this.objects.splice(mapIndex, 1);
    };

    Layer.prototype.show = function () {
        this.visible = true;
    };

    Layer.prototype.hide = function () {
        this.visible = false;
    };

    // Static API

    Layer.remove = function (layer) {

        var mapIndex = layerMap.indexOf(layer);

        if (mapIndex === -1) {
            throw new Error('Layer not present in layer map');
        }

        layerMap.splice(mapIndex, 1);
    };

    Layer.removeAll = function () {
        layerMap = [];
    };

    Layer.getAll = function () {
        return layerMap;
    };

    Layer.getLayerById = function (id) {

        for (var i=0,k=layerMap.length; i<k; i++) {
            if (layerMap[i].id === id) {
                return layerMap[i];
            }
        }

        return null;
    };

    Layer.getLayerByIndex = function (index) {
        return typeof layerMap[index] !== 'undefined'
            ? layerMap[index]
            : null;
    };

    Layer.getLayerByObject = function (layer) {

        var index = layerMap.indexOf(layer);
        return index !== -1
            ? layerMap[index]
            : null;
    };

    Layer.get = function (param) {

        if (util.isString(param)) {
            return this.getLayerById(param);
        }
        else if (util.isNumber(param)) {
            return this.getLayerByIndex(param);
        }
        else if (util.isObject(param)) {
            return this.getLayerByObject(param);
        }

        console.log('Did not find Layer: ', param instanceof String);

        return null;
    };

    return Layer;
})();
