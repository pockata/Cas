module.exports = (function () {

    var Shape = require('../shape');
    var util  = require('../util');

    function Rect (props) {

        Shape.call(this, props);
    }

    util.inherit(Rect, Shape);

    Rect.prototype._defaults = util.extend({}, Shape.prototype._defaults, {
        'width': 100,
        'height': 80
    });

    Rect.prototype.draw = function (ctx, fps) {

        var p = this.props;

        if (!p.visible) return;

        ctx.save();

        Shape.prototype.draw.call(this, ctx, fps);

        ctx.beginPath();
        ctx.rect(p.x, p.y, p.width, p.height);
        ctx.closePath();

        ctx.restore();
    };

    return Rect;
})();
