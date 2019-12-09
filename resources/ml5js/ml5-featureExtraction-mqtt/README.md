# Einführung in ML: Feature Extractor

[MobileNet](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet) ist
ein auf Geschwindigkeit optimiertes Machine Learning Modell zur Erkennung von Bildern.

In diesem Experiment verwenden wir den [FeatureExtractor](https://ml5js.org/docs/FeatureExtractor) des
MobileNet-Modells um einen eigenen Regressor zu trainieren.

Zudem verwenden wir den [Eclipse Paho](https://www.eclipse.org/paho/clients/js/) MQTT-Client zur
Weiterleitung der Prediction-Werte an einen MQTT-Broker. Das erlaubt uns IoT-Geräte direkt aus
der Anwendung heraus zu steuern.

## Installation

ML5js-Experimente werden über einen Webserver zur Verfügung gestellt.
Hierfür muss ein Webserver installieren werden. Dies geschieht wie gewohnt über NPM:

```bash
npm install
```

## Das Experiment starten

Das Experiment starten wir nun wie gewohnt über npm:

```bash
cd C:\Projekt\Ordner
npm start
```

Danach ist die Übung über einen Webbrowser der Wahl unter folgender Addresse erreichbar:
[http://localhost:1234](http://localhost:1234)