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
});
