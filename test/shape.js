/* global describe, it */
var expect = require('chai').expect;
var Shape  = require('../lib/shape');

describe('Shape object', function () {

    var shape = new Shape({
        'x': 10,
        'newProp': false
    });

    describe('#constructor', function () {

        it('should generate a valid id', function () {
            expect(shape.id).to.exist;
            expect(shape.id).to.be.a('string');
            expect(shape.id.length).to.equal(36);
        });

        it('should extend default properties with provided ones', function () {
            expect(shape.props.x).to.equal(10);
            expect(shape.props.newProp).to.exist;
            expect(shape.props.newProp).to.equal(false);
        });
    });

    describe('#_attachHelpers', function () {

        it('should attach getters/setters for properties', function () {
            expect(shape.x).to.equal(10);
        });
    });

    describe('Animations', function () {

        it('should stop current object animations on demand', function (done) {

            var shape = new Shape();

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

            var shape = new Shape();

            expect(shape.x).to.equal(0);

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
                shape.draw(null, fps);
            }, 1000/fps);
        });
    });
});
