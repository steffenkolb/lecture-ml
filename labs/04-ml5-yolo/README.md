# Einführung in ML: YOLO!

In dieser Übung nutzen wir fertig Modelle, welche durch Machine Learning Methoden erzeugt wurden.
Hierfür verwenden wir die Machine Learning Bibliothek [ml5js](https://ml5js.org).
Diese Bibliothek stellt einige fertig Modelle zur Verfüguing.

[YOLO](https://pjreddie.com/yolo/) ist eine sehr schnelle Echtzeit-Objekterkennung welche ein einzelnes neuronales Netz nutzt.
Wir verwenden die JavaScript Portierung von [ML5js](https://learn.ml5js.org/docs/#/reference/yolo).

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

## Aufgabe

Starte das Experiment und prüfe die Funktionalität.
Anschließend:

1. Suche dir drei Objekte aus, die gut von YOLO erkannt werden
2. Schreibe die Namen der gefunden Objekte in eine Liste unter das Videobild