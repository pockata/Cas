# CAS - CAnvas Simplified
Cas is as an HTML5 Canvas abstraction layer for Node (and the browser) developed mainly for use on the Raspberry Pi on top of the [openvg-canvas](https://github.com/luismreis/node-openvg-canvas) module.

## Project State
The project is in alpha state. Many things can and will be updated/improved.  
Currently only Rectangle and Image abstraction objects are available, but more will come.

## Install
Fetch the source and install dependencies:
```sh
git clone https://github.com/pockata/cas.git
cd cas
npm install
```
Or use NPM instead:
```sh
npm install canvas-simplified --save
```

## Usage
```javascript
// Load the library
var Cas = require('canvas-simplified');

// Set a reference to a canvas object (the equivalent of document.getElementById('canvas'))
Cas.setCanvas(canvasObject);

// Attempt to run at 60 fps
Cas.setFPS(60);

// Create a layer (can have multiple layers)
var layer = new Cas.Layer();

// Create a rectangular shape
var rect = new Cas.Rect({
    'x': 100,
    'y': 200,
    'width': 100,
    'height': 100,
    'stroke': 'red',
    'fill': 'yellow'
});

// Add the shape to the layer
layer.addObject(rect);

// Set some animations
rect.animate({
    'props': {
        'x': 300,
        'width': 200,
        'height': 200
    },
    'duration': 1000
});

rect.animate({
    'props': {
        'y': 600,
        'width': 100,
        'height': 100,
        'angle': 45 // angle in degrees
    },
    'duration': 1000,
    'easing': 'easeInOutBack'
});

// Start the draw loop
Cas.setLoop(function () {
    Cas.drawLayers();
});
```

## License
MIT License
