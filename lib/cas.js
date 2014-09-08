module.exports = (function () {

    var Layer = require('./layer');
    var Shape = require('./shape');

    var layers = Layer.getAll();

    var globalCTX = null;
    var globalFPS = 60;

    function draw () {

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

    function setFPS(fps) {

        fps = parseInt(fps, 10);

        if ( !fps || fps < 0) {
            throw new Error('FPS count is invalid');
        }

        globalFPS = fps;
    }

    return {
        'draw': draw,
        'setCanvas': setCanvas,
        'setFPS': setFPS,
        'Layer': Layer,
        'Shape': Shape
    };
})();
