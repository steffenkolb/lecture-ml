/**
 * This project creates a duplex connection between a website and wekinator.
 * It uses websockets to communicate between the webserver and the website.
 * Communication between the webserver and Wekinator uses OSC messages.
 * 
 * Training and Input
 * Website -[Websocket]-> Webserver -[OSC]-> Wekinator
 * 
 * Regression
 * Website -[Websocket]-> Webserver -[OSC]-> Wekinator -[OSC]-> Webserver -[Websocket]-> Website
 * 
 * See: https://github.com/socketio/socket.io
 * See: https://github.com/MylesBorins/node-osc
 * 
 * base node + wekinator integration used from https://github.com/noisyneuron/wekOsc
 * updated and refined by Steffem Kolb @ https://github.com/steffenkolb/lecture-ml
 */

 // Define ports and addresses for webserver and Wekinator 
var WEBSERVER_PORT = 1234;
var WEBSERVER_IP = '127.0.0.1';
var WEKINATOR_INPUT_PORT = 6448;
var WEKINATOR_OUTPUT_PORT = 12000;
var CONNECTED_USERS = 0;

// Load webserver libraries
var express = require('express');
var app = express();
var path = require('path');

// Create a webserver
var server = require('http').createServer(app);

// Load webserver library
var io = require('socket.io')(server);

// Load OSC library
const { Client, Server } = require('node-osc');

// Connect to wekinator via OSC
const client = new Client(WEBSERVER_IP, WEKINATOR_INPUT_PORT);

/** 
 * Open a websocket connection to receive X and Y coordinates from the website
 */
io.on('connection', function (websocket) {
  // a user has connected
  console.log("a user has connected");

  // only one user may be connected at any time!
  if(CONNECTED_USERS > 0) {
    console.log("Another user is already connected. Please ensure all browser windows are closed.")
    return;
  }
  // count users
  CONNECTED_USERS += 1;

  // forward data received via websocket to OSC
  websocket.on('inputData', function (data) {
    // activate for debugging
    /* console.log(data); */

    // send data via OSC to wekinator
    inputDeviceData(data.x, data.y);
  });

  /**
   * Create a new OSC-server to receive OSC output-messages from Wekinator.
   * Those messages are then directly send to the website via websockets.
   */
  var oscServer = new Server(WEKINATOR_OUTPUT_PORT, WEBSERVER_IP);
  
  oscServer.on('message', function (msg) {
    // activate for debugging
    //console.log(msg);

    // forward message via websocket
    websocket.emit('outputData', msg);
  });

  // if a user disconnects, we need to close the OSC connection as well
  websocket.on('disconnect', function(){
    console.log('a user disconnected, cleaning up resources');
    oscServer.close();

    // keep track of connected users
    CONNECTED_USERS -= 1;
  });

  // this method registers, if the user wants to start recording for a gesture
  websocket.on('startRecording', function (gesture) {
    startRecording(gesture);
  });

  // this method registers, if the user wants to stop recording for a gesture
  websocket.on('stopRecording', function () {
    stopRecording();
  });

  // this method registers, if the user wants to start predictions
  websocket.on('startPrediction', function () {
    startPrediction();
  });

  // this method registers, if the user wants to stop predictions
  websocket.on('stopPrediction', function () {
    stopPrediction();
  });

  // this method registers, if the user wants to stop predictions
  websocket.on('deleteModel', function () {
    deleteModel();
  });
});

/*
 * WEKINATOR CONTROLS
 * 
 * See: http://www.wekinator.org/detailed-instructions/#Controlling_Wekinator_via_OSC_messages
 */

/**
 * This methods sends X and Y values as input-messages via OSC to Wekinator
 */
inputDeviceData = function (x, y) {
  // Wekinator expects the values as object with type
  var inputX = { type: "float", value: x };
  var inputY = { type: "float", value: y };

  // sent to wekinator
  client.send('/wek/inputs', inputX, inputY);
}

/**
 * This method calls Wekinator to start recording of a certain gestures
 */
startRecording = function (gesture) {
  // we need to send the gesture as an object
  let dtwGesture = { type: "integer", value: gesture };
  client.send('/wekinator/control/startDtwRecording', dtwGesture);
}

/**
 * This method calls Wekinator to stop recording of gestures
 */
stopRecording = function () {
  client.send('/wekinator/control/stopDtwRecording');
}

/**
 * Calls Wekinator to start prediction
 */
startPrediction = function () {
  client.send('/wekinator/control/startRunning');
}

/**
 * Calls Wekinator to stop prediction
 */
stopPrediction = function () {
  client.send('/wekinator/control/stopRunning');
}

/**
 * Calls Wekinator to delete all training data
 */
deleteModel = function () {
  client.send('/wekinator/control/deleteAllExamples');
}



/*
 * WEBSERVER SETUP and start
 */

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res,next) {
  res.sendFile(__dirname + '/index.html');
});

// start webserver
server.listen(WEBSERVER_PORT);

console.log("Webpage available at : http://" + WEBSERVER_IP + ":" + WEBSERVER_PORT);
console.log("OSC output port: " + WEKINATOR_OUTPUT_PORT);
console.log("OSC input port: " + WEKINATOR_INPUT_PORT);