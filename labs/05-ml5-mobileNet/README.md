# Einführung in ML: Feature Extractor

[MobileNet](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet) ist
ein auf Geschwindigkeit optimiertes Machine Learning Modell zur Erkennung von Objekten in Bildern.

Wir werden das [Modell von ML5js](https://learn.ml5js.org/docs/#/reference/image-classifier) verwenden um das Livebild eurer Notebookkamera zu analysieren.

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

## Aufgabe 1

Starte das Experiment und prüfe ob das Kamerabild sichtbar ist
Anschließend implementieren wir einen Image-Classifier in der  Datei `public/sketch.js`:

1. Füge das MobileNet Modell in die `setup()`-Methode ein:

    ```javascript
    classifier = ml5.imageClassifier('MobileNet', video, modelReady);
    ```

    Hiermit wird ein `MobielNet`-Classifier erzeugt, mit dem Video-Bild als Input. Sobald das Modell geladen wurde, wir die Methode `modelReady` aufgerufen (diese ist bereits im Code hinterlegt).

2. Starte die Erkennung des Classifiers mit jedem Durchlauf der `draw()`-Methode:

    ```javascript
    classifier.classify(gotResult);
    ```

    Diese Zeile startet die Klassifikation des aktuellen Kamerabilds. Anschließend wird die Methode `gotResults` aufgerufen.

3. Implementiere die Methode `gotResults` um die Ergenisse auszugeben (z.B. über `console.log(...)`):

    ```javascript
    function gotResult(err, results) {
        // do something with the results here
    }
    ```

    Das `results`-Objekt ist ein Array aus Ergebnissen. Jedes Ergebnis besteht aus einem `label` (Bezeichner) und der `confidence` (prozentuale Sicherheit), dass das Objekt korrekt erkannt ist. Die Objekte sind so sortiert, dass das erste Objekt im Array am wahrscheinlichsten ist:

    ```javascript
    results = [ {
        "confidence": 0.80705750435590744,
        "label": "Dog"
    },{
        "confidence": 0.07249042391777039,
        "label ": "Cat"
    },{
        "confidence": 0.05277078226208687
        "label": "Bird"
    }
    ```

Die Übung sollte nun komplett lauffähig sein, und die Ergebnisse in der `gotResults`-Methode behandelt werden

## Aufgabe 2

Erweitere das Ergebnis aus Aufgabe 1:

1. Gib das *sicherste* Ergebnis als Text auf dem Video aus
    * Speichere das *sicherste* Ergebnis in eine globale Variable
    * Nutze P5js `text()` (https://p5js.org/reference/#/p5/text)
    * Aktualisiere den Text innerhalb der `draw()`-Methode

2. Macht ein Spiel daraus. Der Benutzer soll 3 Begriffe suchen und den Kamera zeigen.
    * Speichere die gesuchten Begriffe in einer Variablen. Merke dir das aktuell gesuchte.

    ```javascript
    const words = ["banana", "shoe", "cellphone"];
    let currentWord = 0;
    ```

    * Gebe das aktuell gesuchte Word `currentWord` in der `draw()`-Methode aus
    * Erweitere die `gotResults()`-Methode und prüfe, ob das aktuell gesuchte Word gefunden wurde

    ```javascript
    if(results[0].label == words[currentWord]) {
        // das wort wurde erkannt
        // Lobe den Spieler!

        // springe zum nächsten Wort
        currentWord = currentWord + 1;
    }
    ```

    * Tipp: Das MobileNet funktioniert auch mit Bilder auf eurem Handy :)