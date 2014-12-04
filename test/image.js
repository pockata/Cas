/* global describe, it, before */
/* jshint expr: true */

var expect = require('chai').expect;
var Shape  = require('../lib/shape');
var Img    = require('../lib/shapes/image');

describe('Image shape', function () {

    var image;

    before(function () {

        function imageStub () {
            this.src = '';
            this.width = 100;
            this.height = 100;
        }

        image = new Img({
            'x': 100,
            'y': 200,
            'imageObject': imageStub
        });
    });

    describe('#constructor', function () {

        it('should inherit the Shape object', function () {
            expect(image).to.be.an.instanceof(Shape);
        });

        it('should set getters/setters for new instance  properties', function () {
            expect(image.x).to.exist;
            expect(image.opacity).to.exist;
        });
    });
});
