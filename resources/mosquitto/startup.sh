#!/bin/bash
docker run -it --name websocket-mqtt-broker -p 1883:1883 -p 9001:9001 -v "$(pwd)/mosquitto.conf:/mosquitto/config/mosquitto.conf:ro" eclipse-mosquitto