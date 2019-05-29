/**
 * In diesem Experiment verwenden wir einen FeatureExtractor des MobileNet-Modells
 * und nutzen diesen um einen eigenen Regressor zu trainieren.
 * 
 * see: https://ml5js.org/docs/FeatureExtractor
 */

let featureExtractor;
let regressor;
let video;
let loss;
let slider;
let samples = 0;
let lightValue = 127;
let mqttTopic = "hfg/iot/ml";

/**
 * The setup() function is called once when the program starts.
 * It's used to define initial environment properties such as
 * screen size and background color and to load media such as
 * images and fonts as the program starts. 
 * 
 * See: https://p5js.org/reference/#/p5/setup
 */
function setup() {
  const canvas = createCanvas(340, 280);
  canvas.parent('videoContainer');
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Extract the features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);

  // Create a new regressor using those features and give the video we want to use
  regressor = featureExtractor.regression(video, videoReady);

  // Create the UI buttons
  setupButtons();
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
  fill(lightValue, lightValue, lightValue);
  circle(170, 140, 50, 50);
}

// This function is called when the model was successfully loaded
function modelReady(){
  select('#status').html('Model loaded successfully');
}

// This function is called when the regressor is ready to consume the video information
function videoReady(){
  select('#statusVideo').html('Video ready');
}

// Classify the current frame.
function predict() {
  regressor.predict(gotResults);
}

// A util function to create UI buttons
function setupButtons() {
  slider = select('#slider');
  // When the 'Add Sample' button is pressed, add the current frame
  // from the video with the current slider-value als label to the classifier
  select('#addSample').mousePressed(function() {
    regressor.addImage(slider.value());
    select('#amountOfSamples').html(samples++);
  });

  // Train Button
  select('#train').mousePressed(function() {
    regressor.train(function(lossValue) {
      // Train the regressor model and display the current loss value
      if (lossValue) {
        loss = lossValue;
        select('#loss').html('Loss: ' + loss);
      } else {
        select('#loss').html('Training done (loss: ' + loss + ')');
      }
    });
  });

  // Predict Button
  select('#buttonPredict').mousePressed(predict);
}

// Forward values to MQTT broker
function sendMessage(payload) {
  if(clientConnected) {
    let message = new Paho.MQTT.Message(str(payload));
    message.destinationName = mqttTopic;
    client.send(message);
  }
}

// Show the results
function gotResults(err, result) {
  if (err) {
    console.error(err);
  }
  if (result && result.value) {
    // map the regression-prediction to a usable light-value
    // the model will return values between 0 and 1
    // we will map these to a range of 0 to 255
    lightValue = map(result.value, 0, 1, 0, 255);
    slider.value(result.value);

    // forward value to mqtt broker
    sendMessage(lightValue);

    // start predicting again
    predict();
  }
}