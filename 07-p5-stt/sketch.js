/**
 * Speech to Text mit P5js Speech-Library
 * 
 * See: http://ability.nyu.edu/p5.js-speech/
 */
var speechRec = new p5.SpeechRec('en-US', parseResult); // new P5.SpeechRec object
speechRec.continuous = true; // do continuous recognition
speechRec.interimResults = true; // allow partial recognition (faster, less accurate)

// store the most recent phrase in this variable
var mostRecentPhrase;

/**
 * The setup() function is called once when the program starts.
 * It's used to define initial environment properties such as
 * screen size and background color and to load media such as
 * images and fonts as the program starts. 
 * 
 * See: https://p5js.org/reference/#/p5/setup
 */
function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('videoContainer');
  background(255, 255, 255);

  // Text setup
  fill(0, 0, 0, 255);
  textSize(20);
  textAlign(LEFT);

  speechRec.start(); // start engine
}

/**
 * Called directly after setup(), the draw() function continuously
 * executes the lines of code contained inside its block until
 * the program is stopped or noLoop() is called. 
 * 
 * See: https://p5js.org/reference/#/p5/draw
 */
function draw() {
  background(255, 255, 255);
  text("Say something!", 20, 20);
  text("I heard: " + mostRecentPhrase, 20, 60);
}

// Parse the result and store in variable
function parseResult() {
  mostRecentPhrase = speechRec.resultString;
  console.log(mostRecentPhrase);
}