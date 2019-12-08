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

// global value to store activated gesture
var currentGesture = 1;

// global value to choose between recording and prediction
var shouldRecord = false;
var shouldPredict = false;

var btnToggleRecording;
var btnTogglePredict;
var btnDeleteModel;

// global value to store predicted gesture by Wekinator
var predictedGesture = 0;

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

  // define button presses
  setupButtons();

  // Call a method whenever the mouse is pressed on the canvas
  // See: https://p5js.org/reference/#/p5.Element/mousePressed
  canvas.mousePressed(startRecording);

  // Store the gesture from the dropdown
  select('#gesture-select').input(function() {
    currentGesture = parseInt(this.elt.value);
  })

  // this method will be called if output from wekinator is received
  socket.on('outputData',
    function(data) {
      // did we receive a gesture?
      if(data.length == 1){
        // gestures will have the same name defined in Wekinator, here you see the default values
        if(data[0] == '/output_1') {
          console.log('Recognized a swipe right');
          predictedGesture = 1;
        } else if (data[0] == '/output_2') {
          console.log('Recognized a swipe down');
          predictedGesture = 2;
        }
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
  fill(100,100,100);
  noStroke();
  ellipse(mouseX, mouseY, 25, 25);

  textSize(18);
  if(predictedGesture === 1) {
    fill(200, 100, 0);
    text("right", mouseX + 25, mouseY + 5);
  } else if (predictedGesture === 2) {
    fill(0, 200, 100);
    text("down", mouseX - 20, mouseY + 35);
  }
  // Add a third gesture here

  background('rgba(200,200,200,0.1)');
}






/// Below are utility methods for calling the NodeJS webserver


// Utility method for setting up the button-presses
function setupButtons() {
  // If the toggleRecording button is pressed we switch between to recording
  btnToggleRecording = select('#toggleRecording');
  btnToggleRecording.mouseClicked(toggleRecording);

  // If the btnTogglePredict button is pressed we switch to prediction
  btnTogglePredict = select('#togglePrediction');
  btnTogglePredict.mouseClicked(togglePrediction);

  // If the deleteModel button is pressed the current trainingdata is deleted
  btnDeleteModel = select('#deleteModel');
  btnDeleteModel.mouseClicked(deleteModel);
}


/**
 * This method is called whenever the user drags the mouse cursor over the canvas
 * 
 * See: https://p5js.org/reference/#/p5/mouseDragged
 */
function mouseDragged() {
  // we will sent the X and Y values of the mouse directly via the websocket connection
  socket.emit('inputData', { x: mouseX, y:mouseY });
}

/**
 * Create a websocket message to start recording, if recording button is active
 */
function startRecording() {
  if(shouldRecord) {
    socket.emit('startRecording', currentGesture);
  }
}

/**
 * Create a websocket message to stop recording
 */
function stopRecording() {
  socket.emit('stopRecording');
}

function toggleRecording() {
  shouldRecord = !shouldRecord;
  shouldPredict = false;
  btnToggleRecording.elt.classList.toggle('button-primary');
  btnTogglePredict.elt.classList.remove('button-primary')
}

/**
 * Create a websocket message to start prediction
 */
function startPrediction() {
  socket.emit('startPrediction');
}

/**
 * Create a websocket message to stop prediction
 */
function stopPrediction() {
  socket.emit('stopPrediction');
}

function togglePrediction() {
  shouldRecord = false;
  shouldPredict = !shouldPredict;
  btnTogglePredict.elt.classList.toggle('button-primary');
  btnToggleRecording.elt.classList.remove('button-primary')

  if (shouldPredict) {
    startPrediction();
  } else {
    stopPrediction();
  }
}

/**
 * Create a websocket message to delete current model
 */
function deleteModel() {
  socket.emit('deleteModel');
}