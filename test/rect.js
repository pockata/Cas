/* global describe, it, before */
/* jshint expr: true */

var expect = require('chai').expect;
var Shape  = require('../lib/shape');
var Rect   = require('../lib/shapes/rect');

describe('Rectangle shape', function () {

    var rect;

    before(function () {
        rect = new Rect({
            'x': 100, 'y': 200,
            'width': 300, 'height': 400
        });
    });

    describe('#constructor', function () {

        it('should inherit the Shape object', function () {
            expect(rect).to.be.an.instanceof(Shape);
        });

        it('should extend default Shape properties', function () {
            expect(rect._defaults.opacity).to.exist;
            expect(rect._defaults.width).to.exist;
            expect(rect._defaults.height).to.exist;
        });

        it('should set instance properties copied from defaults', function () {
            expect(rect.props.opacity).to.exist;
            expect(rect.props.x).to.exist;
            expect(rect.props.width).to.exist;
        });

        it('should set getters/setters for new instance  properties', function () {
            expect(rect.x).to.exist;
            expect(rect.opacity).to.exist;
            expect(rect.width).to.exist;
            expect(rect.height).to.exist;
        });
    });
});
