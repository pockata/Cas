module.exports = (function () {

    var Shape   = require('../shape');
    var inherit = require('../util').inherit;

    function Rect (props) {

        Shape.call(this, props);

        if (!this.props.x || !this.props.y ||
            !this.props.w || !this.props.h) {
            throw new Error('Rect requires x,y,w,h as options');
        }
    }

    inherit(Rect, Shape);

    Rect.prototype.draw = function (ctx, fps) {
        Shape.prototype._runAnimations.call(this, ctx, fps);
        // ctx.save();
        // console.log('drawing rect');
        ctx.beginPath();
        ctx.rect(this.props.x, this.props.y, this.props.w, this.props.h);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.lineWidth = 7;
        ctx.strokeStyle = 'black';
        ctx.stroke();

        // ctx.restore();
    };

    return Rect;
})();
