#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Pin number on board where LED is connected to
#define B_PIN D5
#define G_PIN D6
#define R_PIN D7

// replace the following values with your information
const char* ssid = "mobile medien";
const char* password = "iot_rockz";

// every mqtt client must have its own name; choose anything
const char* mqttClientName = "YOUR_CLIENT_NAME";

// IP address or URL of your MQTT broker/server.
// For demo purposes you can use  the public mosquitto broker "test.mosquitto.org"
// See http://test.mosquitto.org
const char* mqttServer = "192.168.178.27";

// basic mqtt port; should not be changed
const int mqttPort = 1883;

// topic to receive LED data
const char* ledTopic = "hfg/iot/ml";

WiFiClient espClient;
PubSubClient mqttClient(espClient);

void connectToWifi() {
  //
  delay(4000);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }

  Serial.println("Connected to the WiFi network");
}

void connectToMqtt() {
  mqttClient.setServer(mqttServer, mqttPort);
  while (!mqttClient.connected()) {
    Serial.println("Connecting to MQTT...");

    if (mqttClient.connect(mqttClientName)) {
      Serial.println("connected");
    } else {
      Serial.print("failed with state ");
      Serial.print(mqttClient.state());
      Serial.println();
      delay(2000);
    }
  }
}

/** 
 *  This function is called whenever a new message arrives from the MQTT broker 
 */
void callback(char* topic, byte* payload, unsigned int length) {
  // We will simply print the message to the serial-output
  Serial.print("Message arrived at '");
  Serial.print(topic);
  Serial.print(": ");

  // convert character-array to int with atoi: http://www.cplusplus.com/reference/cstdlib/atoi/
  int intValue = atoi((char *)payload);
  Serial.println(intValue);

  // set LED value
  analogWrite(R_PIN, intValue);
  analogWrite(G_PIN, intValue);
  analogWrite(B_PIN, intValue);

  // delete old values
  memset(payload, 0, length);
}

void setup() {
  Serial.begin(115200);

  // 0. Set mode for this pin to 'Output'
  pinMode(B_PIN, OUTPUT);
  pinMode(G_PIN, OUTPUT);
  pinMode(R_PIN, OUTPUT);

  // 1. Establish connection to the network
  connectToWifi();

  // 2. Establish connection to the MQTT broker
  connectToMqtt();
  
  // 3. Subscribe to LED topic to receive messages
  mqttClient.subscribe(ledTopic);

  // 4. Specify the function to be called whenever an MQTT message arrives
  mqttClient.setCallback(callback);
}

void loop() {
  if (!mqttClient.connected()) {
    connectToMqtt();
  }

  mqttClient.loop();
}

