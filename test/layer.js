/* global describe, it, before */
/* jshint expr: true */

var expect = require('chai').expect;
var Layer  = require('../lib/layer');


describe('Layers API', function () {

    describe('Layer.create', function () {

        var layer;

        before(function () {
            layer = new Layer();
        });

        it('should return a valid Layer instance', function () {
            expect(layer).to.be.an.instanceof(Layer);
        });

        it('should add a "layer" instance to the layer map', function () {
            var firstLayer = Layer.getLayerByIndex(0);
            expect(firstLayer).to.be.an.instanceof(Layer);
            expect(firstLayer.id).to.exist;
            expect(firstLayer.id).to.equal(layer.id);
        });
    });

    describe('#constructor', function () {

        var layer;
        before(function () {
            layer = new Layer();
        });

        it('should generate a valid id', function () {
            expect(layer.id).to.exist;
            expect(layer.id).to.be.a('string');
            expect(layer.id.length).to.equal(36);
        });
    });

    describe('#moveToBottom', function () {

        it('should move a layer to the bottom', function () {

            Layer.removeAll();

            var layer1 = new Layer();
            var layer2 = new Layer();
            var layer3 = new Layer();
            var layer4 = new Layer();

            // redundant, for jshint
            layer2.show();
            layer3.show();

            expect(Layer.getLayerByIndex(0).id).to.equal(layer1.id);

            layer4.moveToBottom();

            expect(Layer.getLayerByIndex(0).id).to.equal(layer4.id);
        });
    });

    describe('#moveToTop', function () {

        it('should move a layer to the top', function () {

            Layer.removeAll();

            var layer1 = new Layer();
            var layer2 = new Layer();
            var layer3 = new Layer();
            var layer4 = new Layer();

            // redundant, for jshint
            layer2.show();
            layer3.show();
            layer4.show();

            expect(Layer.getLayerByIndex(0).id).to.equal(layer1.id);

            layer1.moveToTop();

            expect(Layer.getLayerByIndex(3).id).to.equal(layer1.id);
        });
    });

    describe('#moveToIndex', function () {
        it('should move a layer to a specified index', function () {

            Layer.removeAll();

            var layer1 = new Layer();
            var layer2 = new Layer();
            var layer3 = new Layer();
            var layer4 = new Layer();

            // redundant, for jshint
            layer2.show();
            layer3.show();
            layer4.show();

            expect(Layer.getLayerByIndex(0).id).to.equal(layer1.id);

            layer1.moveToIndex(3);

            expect(Layer.getLayerByIndex(3).id).to.equal(layer1.id);

            layer1.moveToIndex(1);

            expect(Layer.getLayerByIndex(1).id).to.equal(layer1.id);
        });
    });
});
