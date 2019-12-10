/**
 * In diesem Experiment verwenden wir einen FeatureExtractor des MobileNet-Modells
 * und nutzen diesen um einen eigenen Regressor zu trainieren.
 * 
 * see: https://learn.ml5js.org/docs/#/reference/feature-extractor
 */

 // variables for storing accessing the video, the regressor and the slider
let video;
let regressor;
let slider;

// this varialbe will store the currently detected light-value
let lightValue = 5;

/**
 * The setup() function is called once when the program starts.
 * It's used to define initial environment properties such as
 * screen size and background color and to load media such as
 * images and fonts as the program starts. 
 * 
 * See: https://p5js.org/reference/#/p5/setup
 */
function setup() {
  // Create canvas
  const canvas = createCanvas(340, 280);
  canvas.parent('videoContainer');

  // create video container
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Access the slider
  slider = select('#slider');
  
  // Extract the features from MobileNet
  let featureExtractor = ml5.featureExtractor('MobileNet', modelReady);

  // Create a new regressor using those features and give the video we want to use
  regressor = featureExtractor.regression(video, videoReady);

  // Add sample when pressing the button
  select('#addSample').mousePressed(function () {
    regressor.addImage(slider.value());
  });

  // Start training on button-press
  select('#train').mousePressed(function () {
    regressor.train(function (lossValue) {
      console.log(lossValue);
    });
  });

  // Start prediction on button-press
  select('#predict').mousePressed(function () {
    regressor.predict(handleResults);
  });
}

/**
 * Called directly after setup(), the draw() function continuously
 * executes the lines of code contained inside its block until
 * the program is stopped or noLoop() is called. 
 * 
 * See: https://p5js.org/reference/#/p5/draw
 */
function draw() {
  frameRate(5);
  image(video, 0, 0, 340, 280);
  noStroke();

  // this line will fill the subsequent graphics with the predicted "lightValue"
  // because the value is between 0 and 1, we need to multiply it
  fill(lightValue * 255);

  // draw the light
  circle(170, 140, 50, 50);
}

// Handle the results
function handleResults(err, result) {
  lightValue = result.value;

  // start predicting again
  regressor.predict(handleResults);
}

//// These are helper functions: nothing for you to do here


// This function is called when the model was successfully loaded
function modelReady() {
  select('#status').html('Model loaded successfully');
}

// This function is called when the regressor is ready to consume the video information
function videoReady() {
  select('#statusVideo').html('Video ready');
}