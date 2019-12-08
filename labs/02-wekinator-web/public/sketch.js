/**
 * This P5JS sketch creates a websocket connection to a Nodejs webserver.
 * 
 * It will send the X and Y coordinates of the mouse to the webserver (for model training).
 * The Nodejs server on the other hand will sent the regression values back via the websocket-connection.
 * Those values are then interpreted as RGB values and will be displayed as the background color of the canvas.
 * 
 * By Steffen Kolb @ https://github.com/steffenkolb/lecture-ml
 */

var socket;

// global values to store the regression values
var r = 100;
var g = 100;
var b = 100;

/**
 * The setup() function is called once when the program starts.
 * It's used to define initial environment properties such as
 * screen size and background color and to load media such as
 * images and fonts as the program starts. 
 * 
 * See: https://p5js.org/reference/#/p5/setup
 */
function setup() {
  // create websocket connection
  socket = io.connect(window.location.origin);

  // create canvas
  canvas = createCanvas(960, 640);
  canvas.parent('canvasContainer');
  noCursor();

  // activate for debugging
  /* socket.on('ping', function (data) {
    console.log(data);
  }); */

  // this method will be called if websocket-data (regression values) are received
  socket.on('outputData',
    function(data) {

      // activate for debugging
      //console.log(data);

      // regression values are values between 0 and 1
      // in order to show colors, we will translate those to the 0 to 255 range
      // See: https://p5js.org/reference/#/p5/map
      r = map(data[1], 0, 1, 0, 255);
      g = map(data[2], 0, 1, 0, 255);
      b = map(data[3], 0, 1, 0, 255);
    }
  );
}

/**
 * Called directly after setup(), the draw() function continuously
 * executes the lines of code contained inside its block until
 * the program is stopped or noLoop() is called. 
 * 
 * See: https://p5js.org/reference/#/p5/draw
 */
function draw() {
  background(r, g, b);
  ellipse(mouseX, mouseY, 25, 25);
}

/**
 * This method is called whenever the user moves the mouse cursor over the canvas
 * 
 * See: https://p5js.org/reference/#/p5/mouseMoved
 */
function mouseMoved() {
  // we will sent the X and Y values of the mouse directly via the websocket connection
  socket.emit('inputData', { x: mouseX, y:mouseY });
}