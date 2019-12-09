/**
 * Der Eclipse Paho MQTT Client ist leichtgewichtiger MQTT client zur Verbindung von Websites und IoT Geräten.
 * Zur Verbindung des Browsers mit dem MQTT-Broker werden WebSockets verwendet.
 * Dies werden von allen gängigen, moderenen Browsern unterstützt
 * 
 * Siehe:
 * - https://www.eclipse.org/paho/clients/js/
 * - https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
 * - https://caniuse.com/#feat=websockets
 */

// Fill in you broker details
// Important: the broker needs to support MQTT over Websockets!
// For Mosquitto see: http://www.steves-internet-guide.com/mqtt-websockets/

/* example mosuqitto.org-borker
const broker = {
    hostname: "test.mosquitto.org",
    port: 8080,
    path: "",
}
*/

// localhost broker
const broker = {
    hostname: "localhost",
    port: 9001,
    path: "",
}

// Create a client instance
var client = new Paho.MQTT.Client(broker.hostname, broker.port, broker.path, "regression-client");
var clientConnected = false;


// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect});


// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("Connected to MQTT broker on " + broker.hostname);

  // send hello world
  let message = new Paho.MQTT.Message("Hello");
  message.destinationName = "hfg/ml/iot";
  client.send(message);

  clientConnected = true;
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  clientConnected = false;
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString);
}