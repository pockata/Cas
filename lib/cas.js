module.exports = (function () {

    var Layer = require('./layer');
    var Shape = require('./shape');
    var Rect  = require('./shapes/rect');

    var layers = Layer.getAll();

    var globalCTX = null;
    var globalFPS = 60;

    var canvas = {
        'width': 1000,
        'height': 1000
    };

    function drawLayers () {

        globalCTX.clearRect(0, 0, canvas.width, canvas.height);

        for (var i=0, j=layers.length; i<j; i++) {
            layers[i].draw(globalCTX, globalFPS);
        }
    }

    function setCanvas (canvas) {

        if ( !canvas.getContext) {
            throw new Error('You should pass a valid Canvas or Canvas-compatible object');
        }

        globalCTX = canvas.getContext('2d');
    }

    function setCanvasSize(width, height) {
        canvas.width = parseInt(width, 10);
        canvas.height = parseInt(height, 10);
    }

    function setFPS(fps) {

        fps = parseInt(fps, 10);

        if ( !fps || fps < 0) {
            throw new Error('FPS count is invalid');
        }

        globalFPS = fps;
    }

    function setLoop (loopfn) {

        if (!(loopfn instanceof Function)) {
            loopfn = function () { /* noop*/ };
        }

        (function animloop(time){

            requestAnimationFrame(animloop);
            loopfn(time);
        })();
    }

    return {
        'setLoop': setLoop,
        'drawLayers': drawLayers,
        'setCanvas': setCanvas,
        'setCanvasSize': setCanvasSize,
        'setFPS': setFPS,
        'Layer': Layer,
        'Shape': Shape,
        'Rect': Rect
    };
})();
