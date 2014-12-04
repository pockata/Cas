/* global describe, it, before */
/* jshint expr: true */

var expect = require('chai').expect;
var Shape  = require('../lib/shape');
var fs     = require('fs');
var bEqual = require('buffer-equal');
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

    describe('image loading', function () {

        var fName = '/tmp/test.png';

        before(function (done) {
            var testImage = 'R0lGODlhEwALAKECAAAAABISEv///////yH5BAEKAAIALAAAAAATAAsAAAIdDI6pZ+suQJyy0ocV3bbm33EcCArmiUYk1qxAUAAAOw==';
            fs.writeFile(fName, testImage, 'base64', done);
        });

        it('should load local image properly', function (done) {

            var loader = image.load(fName);
            loader.fail(done);

            loader.then(function () {

                fs.readFile(fName, function (err, data) {
                    if (err) {
                        done(err);
                    }

                    if (bEqual(image.Image.src, data)) {
                        done();
                    }
                    else {
                        done(new Error('Image sources don\'t match'));
                    }
                });
            });
        });
    });
});
