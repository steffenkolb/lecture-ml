/**
 * This P5JS sketch creates a websocket connection to a Nodejs webserver.
 * 
 * It will send the X and Y coordinates of the mouse to the webserver (for model training).
 * The Nodejs server on the other hand will sent the regression values back via the websocket-connection.
 * Those values are then interpreted as RGB values and will be displayed as the background color of the canvas.
 * 
 * Base on https://github.com/ml5js/ml5-examples/blob/development/p5js/FaceApi/FaceApi_Video_Landmarks/
 * Updated by Steffen Kolb @ https://github.com/steffenkolb/lecture-ml
 */

var socket;

// Important variables for face-detection
let faceapi;
let video;
let detections;

// by default all options are set to true
const detection_options = {
  withLandmarks: true,
  withDescriptors: false,
}


// global value to store activated gesture
var currentMood = 1;

// global value to toggle recording and prediction
var shouldPredict = false;
var isRecording = false;


// global value to store predicted gesture by Wekinator
var predictedMood = 0;

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
  canvas = createCanvas(360, 270);
  canvas.parent('canvasContainer');
  noCursor();
  frameRate(5);

  // load up your video
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // define button presses
  setupButtons();

  // create the face-detect model
  faceapi = ml5.faceApi(video, detection_options, modelReady)

  // this method will be called if output from wekinator is received
  socket.on('outputData',
    function(data) {
      // did we receive a result?
      if(data.length > 1 && data[0] == "/wek/outputs" ){
        showMood(data[1]); {
          console.log(data[1]);
        }
      }
    }
  );
}

/**
 * This methods is called when the face-api model has finished loading
 */
function modelReady() {
  console.log('Face detection ready!');

  // start detecting faces (see: https://learn.ml5js.org/docs/#/reference/face-api?id=detect)
  faceapi.detect(gotResults);
}

/**
 * Whenever a face was detected this method will be called
 * 
 * @param {Error} err 
 * @param {*} result Returns an array of objects. Each object contains {alignedRect, detection, landmarks, unshiftedLandmarks}
 */
function gotResults(err, result) {
  if (err) {
    console.log(err);
    return;
  }
  detections = result;

  background(255);
  image(video, 0, 0, width, height);
  if (detections) {
    if (detections.length > 0) {
      //console.log(detections);
      drawLandmarks(detections);

      // if we are currently recording, send the first face detected
      if(isRecording || shouldPredict) {
        sendRecording(detections);
      }
    }

  }
  faceapi.detect(gotResults)
}

function showMood(mood) {
  console.log(mood);
  select('#result').html('');
  let img = createImg('images/' + mood + '.gif');
  select('#result').child(img);
}


/// Below are utility methods

// Utility method to draw the landmarks
function drawLandmarks(detections) {
  noFill();
  stroke(150, 250, 150)
  strokeWeight(2)

  for (let i = 0; i < detections.length; i++) {
    const mouth = detections[i].parts.mouth;
    const nose = detections[i].parts.nose;
    const leftEye = detections[i].parts.leftEye;
    const rightEye = detections[i].parts.rightEye;
    const rightEyeBrow = detections[i].parts.rightEyeBrow;
    const leftEyeBrow = detections[i].parts.leftEyeBrow;

    drawPart(mouth, true);
    drawPart(nose, false);
    drawPart(leftEye, true);
    drawPart(leftEyeBrow, false);
    drawPart(rightEye, true);
    drawPart(rightEyeBrow, false);
  }
}

// Utility method to draw a single part
function drawPart(feature, closed) {

  beginShape();
  for (let i = 0; i < feature.length; i++) {
    const x = feature[i]._x
    const y = feature[i]._y
    vertex(x, y)
  }

  if (closed === true) {
    endShape(CLOSE);
  } else {
    endShape();
  }
}

// Utility method for setting up the button-presses
let btnTogglePredict;

function setupButtons() {
  let btnDeleteModel;
  let btnAddImage;

  // If the toggleRecording button is pressed we switch between to recording
  btnAddImage = select('#addImage');
  btnAddImage.mousePressed(startRecording);

  // If the btnTogglePredict button is pressed we switch to prediction
  btnTogglePredict = select('#togglePrediction');
  btnTogglePredict.mouseClicked(togglePrediction);

  // If the deleteModel button is pressed the current trainingdata is deleted
  btnDeleteModel = select('#deleteModel');
  btnDeleteModel.mouseClicked(deleteModel);
}

/**
 * Create websocket message with the face-landmark values
 */
function sendRecording(detections) {
  //console.log(detections);
  landmarks = detections[0].unshiftedLandmarks;
  socket.emit('inputData', landmarks.positions);
}

/**
 * Create a websocket message to start recording, if recording button is active
 */
function startRecording() {
  isRecording = true;
  socket.emit('startRecording');
}

/**
 * Create a websocket message to stop recording whenever the mouse is released
 */
function mouseReleased() {
  isRecording = false;
  socket.emit('stopRecording');
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
  shouldPredict = !shouldPredict;
  btnTogglePredict.elt.classList.toggle('button-primary');

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