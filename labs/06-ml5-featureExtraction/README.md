# Einführung in ML: Feature Extractor

[MobileNet](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet) ist
ein auf Geschwindigkeit optimiertes Machine Learning Modell zur Erkennung von Bildern.

In diesem Experiment verwenden wir den [FeatureExtractor](https://learn.ml5js.org/docs/#/reference/feature-extractor) des MobileNet-Modells um einen eigenen Regressor zu trainieren. Das Training eines Modells auf die Features eines anderen Modells nennt man [Transfer Learning](https://en.wikipedia.org/wiki/Transfer_learning).

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

1. Um die Features des MobileNet-Modells zu verwenden, müssen wir den `FeatureExtractor` in der `setup()`-Methode erzeugen

    ```javascript
    // Extract the features from MobileNet
    let featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
    ````

2. Als nächstes erzeugen wir das eigene Regressions-Modell auf Grundlage der Features

    ```javascript
    // Create a new regressor using those features and give the video we want to use
    regressor = featureExtractor.regression(video, videoReady);
    ```

3. Den Regressor müssen wir nun mit Beispieldaten füttern. Hierfür möchten wir immer ein Bild hinzufügen, wenn der Knopf `Add Sample` gedrückt wird.

    * Erweitere die `setup()`-Methode und reagiere auf Klicks auf den Button. Um auf Elemente aus den HTML zuzugreifen, gibt es von P5js die [select()](https://p5js.org/reference/#/p5/select) Methode

    ```javascript
    // access element by id
    select('#addSample')
    ```

    * Sobald man den Button hat, registrieren wir einen `mousePressed`-Listener:

    ```javascript
    select('#addSample').mousePressed(function () {
        // do something on mousePressed
    });
    ```

    * Um nun dem Regressor ein Bild hinzufügen, muss man lediglich dessen `addImage`-Methode aufrufen und einen Wert (ein Label) übergeben. Wichtig, es können für die Regression nur Werte zwischen 0 und 1 verwendet werden.:

    ```javascript
    select('#addSample').mousePressed(function () {
        regressor.addImage(slider.value());
    });
    ```
    
    * Trainiere für 3 Position des Sliders jeweils 10 Bilder.

4. Nachdem wir nun Trainingsdaten erzeugen können. Sollten wir das Modell auch trainieren.

    * Greife auf den Button `Train` ebenso zu, wie im Schritt davor (Hinweis, dessen id ist `train`)
    * Um den Regressor zu trainieren, müssen wir lediglich seine `train`-Methode aufrufen (Siehe [featureExtractor.train()](https://learn.ml5js.org/docs/#/reference/feature-extractor?id=train).
    
    Diese erwartet eine `Callback`-Methode und übergibt dort den `LossValue`:

    ```javascript
    regressor.train(function (lossValue) {
      console.log(lossValue);
    });
    ```

5. Nun sind wir fast am Ziel. Wir haben ein trainiertes Modell. Nun soll es auch arbeiten.

    * Wie in der Übung 05 mit `MobileNet`, rufen wir die `predict` Methode des Modells auf. Dies soll allerdings erst beim Klicken auf den Button `Predict` geschehen (Id des Buttons ist `predict`)

    ```javascript
    regressor.predict(handleResults);
    ```

    * Sobald nun ein Ergebnis erkannt wird, wird die Methode `handleResults` aufgerufen. Die sollten wir auch implentieren

    ```javascript
    // Handle the results
    function handleResults(err, result) {
        lightValue = result.value;

        // start predicting again
        regressor.predict(handleResults);
    }
    ```

    Vergiss nicht, dass du am Ende wieder eine neue `Prediction` startest (`regressor.predict(handleResults);`)

Du hast nun ein eigenes Machine Learning Modell, welches aus den Features des MobileNet trainiert wird und aus dem Bild der Webcam *Vorhersagen* treffen kann.

## Aufgabe 2

1. Lasse die Kugel *in deiner Hand schweben*
    * Verändere die Position der Kugel, anstatt die Helligkeit
    * Hinweis: Ein Regressor gibt nur eine Zahl zurück, somit kannst du nur die X- oder Y-Postion der Kugel verändern

2. Verbessere das Beispiel, indem du ausgibst:
    * Wieviele Bilder bereits in den Traingsdaten vorhanden sind
    * Wie groß beim *Training* der *Loss*-Wert ist

3. Ersetze den *Regressor* durch einen *Klassifikator*. Färbe die Kugel je nach Klasse anders ein.
    * Ersetze den Slider durch ein DropDown ([Select / Option](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select))
    * Siehe [featureExtractor.classification](https://learn.ml5js.org/docs/#/reference/feature-extractor?id=classificationvideo-callback)
    * Siehe [featureExtractor.classify](https://learn.ml5js.org/docs/#/reference/feature-extractor?id=classify)
