/* global Image */
module.exports = (function () {

    var fs      = require('fs');
    var Shape   = require('../shape');
    var util    = require('../util');
    var Q       = require('q');
    var request = require('request');

    function Img (props, options) {

        Shape.call(this, props);
        var Constructor = options.imageObject || Img.imageObject;
        this.Image = new Constructor();
    }

    util.inherit(Img, Shape);

    // Assume a browser environment by default
    Img.imageObject = typeof Image ? Image : null;

    Img.prototype._defaults = util.extend({}, Shape.prototype._defaults, {
        'src': null,
        'width': null,
        'height': null,
        'cropX': null,
        'cropY': null,
        'cropWidth': null,
        'cropHeight': null
    });

    Img.prototype.draw = function (ctx, fps) {

        var p = this.props;

        if (!p.visible) return;

        ctx.save();

        Shape.prototype.draw.call(this, ctx, fps);

        var args = [this.Image];
        var width = p.width || this.Image.width;
        var height = p.height || this.Image.height;

        // Add crop x, y, width, and height
        if (p.cropWidth && p.cropHeight) {
            args.push(p.cropX, p.cropY, p.cropWidth, p.cropHeight);
        }

        args.push(p.x, p.y, width, height);

        ctx.drawImage.apply(null, args);
        ctx.restore();
    };

    Img.prototype.load = function (src) {

        if (typeof src !== 'undefined') {
            this.props.src = src;
        }

        var isRemote = this.props.src.search(/^https?:\/\//) !== -1;
        return isRemote ? this._loadFromUrl() : this._loadFromDisk();
    };

    Img.prototype.setSource = function (imageData) {
        this.Image.src = imageData;
        this.props.src = '!direct'; // You never know
    };

    Img.prototype._loadFromUrl = function () {

        var deferred = Q.defer();
        var img = this;

        request({
                url: this.props.src,
                encoding: null
            }, function  (err, res, imageData) {
            if (!err && res.statusCode === 200) {
                img.setSource(imageData);
                deferred.resolve(imageData);
            }
            else {
                deferred.reject(new Error(err));
            }
        });

        return deferred.promise;
    };

    Img.prototype._loadFromDisk = function () {

        var read = Q.nfcall(fs.readFile, this.props.src);
        var img = this;

        read.then(function (imageData) {
            img.setSource(imageData);
        });

        return read;
    };

    return Img;
})();
