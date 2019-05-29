# Einführung in ML 3: Posenet

[Posenet](https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5) ist
ein Machine Learning Model zur Erkennung der Körperhaltung (en. "pose") einer oder mehrerer Personen.

Wir verwenden eine JavaScript-Version für [Tensorflow](https://github.com/tensorflow/tfjs-models/tree/master/posenet).
Diese wird über [ML5js](https://ml5js.org/docs/PoseNet) angesporchen und verwendet [P5js](https://p5js.org/) für den Zugriff auf das DOM und die Webcam.

In diesem Experiment nutzen wir die bereits erkannten Features des PoseNet Modells und füttern damit einen eignen
[K-Nearest Neighbors-Klassifizierer](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm).
Das erlaubt uns eine spezialisierte Erkennung auf Basis eines allgemeinen Models zu erstellen.

## Aufgabe

Starte das Experiment und prüfe die Funktionalität.
Anschließend:

1. Erweitere das Experiment um zwei weitere Klassen
2. Speichere das Datenset des KNN in eine Datei
    * Lade es automatisch beim Laden der Seite

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