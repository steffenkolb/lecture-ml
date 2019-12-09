/**
 * In diesem Experiment verwenden wir einen speech-recognition Modell
 * 
 * see: https://ml5js.org/reference/api-soundClassifier/
 */

let classifier;
// Options for the SpeechCommands18w model, the default probabilityThreshold is 0
const options = { probabilityThreshold: 0.7 };
// Two variable to hold the label and confidence of the result
let label;
let confidence;

function preload() {
  // Load SpeechCommands18w sound classifier model
  classifier = ml5.soundClassifier('SpeechCommands18w', options);
}

/**
 * The setup() function is called once when the program starts.
 * It's used to define initial environment properties such as
 * screen size and background color and to load media such as
 * images and fonts as the program starts. 
 * 
 * See: https://p5js.org/reference/#/p5/setup
 */
function setup() {
  noCanvas();
  // Create 'label' and 'confidence' div to hold results
  label = select("#labelResult");
  confidence = select("#confidenceResult");
  // Classify the sound from microphone in real time
  classifier.classify(gotResult);
}

// A function to run when we get any errors and the results
function gotResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  console.log(results);
  // Show the first label and confidence
  label.html(results[0].label);
  confidence.html(nf(results[0].confidence, 0, 2)); // Round the confidence to 0.01
}