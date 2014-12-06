/* global requestAnimationFrame */
module.exports = (function () {

    var Layer = require('./layer');
    var Shape = require('./shape');
    var Rect  = require('./shapes/rect');
    var Img   = require('./shapes/image');

    var layers = Layer.getAll();

    var canvas = {
        'width':  1000,
        'height': 1000,
        'ctx':    null,
        'fps':    60
    };

    function drawLayers () {

        canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i=0, j=layers.length; i<j; i++) {
            layers[i].draw(canvas.ctx, canvas.fps);
        }
    }

    function setCanvas (canvasObj) {

        if ( !canvasObj.getContext) {
            throw new Error('You should pass a valid Canvas or Canvas-compatible object');
        }

        canvas.ctx    = canvasObj.getContext('2d');
        canvas.width  = canvasObj.width;
        canvas.height = canvasObj.height;
    }

    function setFPS(fps) {

        fps = parseInt(fps, 10);

        if ( !fps || fps < 0) {
            throw new Error('FPS count is invalid');
        }

        canvas.fps = fps;
    }

    function setLoop (loopfn) {

        if (!(loopfn instanceof Function)) {
            throw new Error('setLoop requires a function');
        }

        (function animloop(time){

            requestAnimationFrame(animloop);
            loopfn(time);
        })();
    }

    return {
        'setLoop':    setLoop,
        'drawLayers': drawLayers,
        'setCanvas':  setCanvas,
        'setFPS':     setFPS,
        'Layer':      Layer,
        'Shape':      Shape,
        'Rect':       Rect,
        'Image':      Img
    };
})();
