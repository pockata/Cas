/* global describe, it, before */

var expect = require('chai').expect;
var Shape  = require('../lib/shape');
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

            Layer.deleteAll();

            var layer1 = new Layer();
            var layer2 = new Layer();
            var layer3 = new Layer();
            var layer4 = new Layer();

            // console.log('Layer 1', Layer.layerMap);
            expect(Layer.getLayerByIndex(0).id).to.equal(layer1.id);

            layer4.moveToBottom();
            // console.log('Layer 2', Layer.layerMap);

            expect(Layer.getLayerByIndex(0).id).to.equal(layer4.id);
        });
    });

    describe('#moveToTop', function () {

        it('should move a layer to the top', function () {

            Layer.deleteAll();

            var layer1 = new Layer();
            var layer2 = new Layer();
            var layer3 = new Layer();
            var layer4 = new Layer();

            expect(Layer.getLayerByIndex(0).id).to.equal(layer1.id);

            layer1.moveToTop();

            expect(Layer.getLayerByIndex(3).id).to.equal(layer1.id);
        });
    });

    describe('#moveToIndex', function () {
        it('should move a layer to a specified index', function () {

            Layer.deleteAll();

            var layer1 = new Layer();
            var layer2 = new Layer();
            var layer3 = new Layer();
            var layer4 = new Layer();

            expect(Layer.getLayerByIndex(0).id).to.equal(layer1.id);

            layer1.moveToIndex(3);

            expect(Layer.getLayerByIndex(3).id).to.equal(layer1.id);

            layer1.moveToIndex(1);

            expect(Layer.getLayerByIndex(1).id).to.equal(layer1.id);
        });
    });

    describe('Layer Animations', function () {

        it('should stop current object animations on demand', function (done) {

            Layer.deleteAll();

            var layer = new Layer();
            var shape = new Shape();

            layer.addObject(shape);

            shape.animate({
                'props': {
                    'y': 100
                },
                'duration': 800,
                'onComplete': function () {
                    // this shouldn't be called
                    expect(true).to.equal(false);
                }
            });

            shape.stop();

            setTimeout(function () {
                expect(shape.y).to.equal(0);
                done();
            }, 1000);
        });

        it('should animate queued properties accordingly', function (done) {

            Layer.deleteAll();

            var layer = new Layer();
            var shape = new Shape();

            expect(shape.x).to.equal(0);

            layer.addObject(shape);

            shape.animate({
                'props': {
                    'y': 100
                },
                'duration': 800,
                'onComplete': function () {
                    expect(shape.y).to.equal(100);
                }
            });

            shape.animate({
                'props': {
                    'x': 1000
                },
                'duration': 500,
                'easing': 'easeInOutQuad',
                'onComplete': function() {
                    expect(shape.x).to.equal(1000);
                    shape.animate({
                        'props': {
                            'opacity': 0
                        },
                        'duration': 360,
                        'easing': 'easeOutQuart',
                        'onComplete': function () {
                            expect(shape.opacity).to.equal(0);
                            done();
                        }
                    });
                }
            });

            var fps = 60;
            setInterval(function () {
                // We don't need a canvas, so pass null
                layer.draw(null, fps);
            }, 1000/fps);
        });
    });
});
