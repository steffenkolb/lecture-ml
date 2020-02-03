/**
 * This project creates a simple express server to serve a static website.
 * 
 * by Steffen Kolb @ https://github.com/steffenkolb/lecture-ml
 */

 // Define ports and addresses for webserver and Wekinator 
var WEBSERVER_PORT = 1234;
var WEBSERVER_IP = '127.0.0.1';

// Load webserver libraries
var express = require('express');
var app = express();
var path = require('path');

// Create a webserver
var server = require('http').createServer(app);

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
