// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Real time Object Detection using YOLO and p5.js
=== */

let video;
let yolo;
let status;
let objects = [];


/**
 * The setup() function is called once when the program starts.
 * It's used to define initial environment properties such as
 * screen size and background color and to load media such as
 * images and fonts as the program starts. 
 * 
 * See: https://p5js.org/reference/#/p5/setup
 */
function setup() {
  const canvas = createCanvas(320, 240);
  canvas.parent('videoContainer');
  video = createCapture(VIDEO);
  video.size(320, 240);

  // Create a YOLO method
  yolo = ml5.YOLO(video, modelLoaded);

  // Hide the original video
  video.hide();
  status = select('#status');
}

/**
 * Called directly after setup(), the draw() function continuously
 * executes the lines of code contained inside its block until
 * the program is stopped or noLoop() is called. 
 * 
 * See: https://p5js.org/reference/#/p5/draw
 */
function draw() {
  // draw video image
  image(video, 0, 0, width, height);

  drawObjects(objects);
}

/**
 * This method is called when the model has loaded successfully
 */
function modelLoaded() {
  status.html('Model loaded successfully.');
  detect();
}

/**
 * Recursively starts detection of objects on the image of the camera
 */
function detect() {
  yolo.detect(function (err, results) {
    // store detected objects into variable
    objects = results;

    // recursively call detect again
    detect();
  });
}

/**
 * Will draw a box around the detected objects and add a label to it
 * 
 * See: https://learn.ml5js.org/docs/#/reference/yolo?id=detect
 * 
 * @param {*} objects returns an array of objects containing class names, bounding boxes and probabilities.
 */
function drawObjects(objects) {
  // go through all objects found by the network
  for (let i = 0; i < objects.length; i++) {

    // create label
    noStroke();
    fill(115, 252, 214);
    text(objects[i].label, objects[i].x * width, objects[i].y * height - 5);

    // create rectangle
    noFill();
    strokeWeight(4);
    stroke(115, 252, 214);
    rect(objects[i].x * width, objects[i].y * height, objects[i].w * width, objects[i].h * height);
  }
}