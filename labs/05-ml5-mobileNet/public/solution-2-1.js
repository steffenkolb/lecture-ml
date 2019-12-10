/**
 * In diesem Experiment verwenden den ImageClassificator des MobileNet-Modells
 * 
 * see: https://learn.ml5js.org/docs/#/reference/image-classifier
 */

let video;
let classifier;
let topResult;

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

    // set the framerate to 5 fps to lower compute time
    frameRate(5);

    classifier = ml5.imageClassifier('MobileNet', video, modelReady);
}

/**
 * Called directly after setup(), the draw() function continuously
 * executes the lines of code contained inside its block until
 * the program is stopped or noLoop() is called. 
 * 
 * See: https://p5js.org/reference/#/p5/draw
 */
function draw() {
    // draw the video image to the canvas
    image(video, 0, 0, 340, 280);

    // start classification
    classifier.classify(gotResult);

    // write out the top-result
    text(topResult, 10, 10);
}

function gotResult(err, results) {
    // check if we got a result
    if (results) {
        // store top result in a variable
        topResult = results[0].label;
    }
}

//// Below are helper methods for you

// This function is called when the model was successfully loaded
function modelReady() {
    select('#status').html('Model loaded successfully');
}