/**
 * 
 */

var socket;

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
  socket = io.connect(window.location.origin);
  canvas = createCanvas(960, 640);
  canvas.parent('canvasContainer');
  noCursor();

  socket.on('ping', function (data) {
    console.log(data);
  });

  socket.on('outputData',
    function(data) {

      r = map(data.args[0].value, 0, 1, 0, 255);
      g = map(data.args[1].value, 0, 1, 0, 255);
      b = map(data.args[2].value, 0, 1, 0, 255);

      for(var n = 0; n < data.args.length; n++) {
        println(n + ": " + data.args[n].value);
      }
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

function mouseMoved() {
  socket.emit('inputData', { x: mouseX, y:mouseY });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
