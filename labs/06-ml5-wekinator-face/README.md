# Einführung in ML: ML5js mit Wekinator (face)

In diesem Experiment kombinieren wir ein vortrainiertes Modell von ML5js mit der Lernfähigkeit von Wekinator.

Wir verwenden die [Face-API](https://learn.ml5js.org/docs/#/reference/face-api) von ML5js um die sogenannten *Landmarks* (Merkmale) des Gesichts zu erkennen. Die *Koordinaten* dieser Merkmale nutzen wir dann als Eingangssignal für Wekinator.

## Installation

### Node.js

Dieses Experiment startet einen Node.js Server und stellt die Webinhalte statisch zur Verfügung.
Hierfür müssen einige Module installiert werden.

```bash
npm install
```

### Wekinator

Starte ein neues Wekinator-Projekt mit den folgenden Einstellungen:

| Einstellung | Wert |
|--|--|
| Input Port | 6448 |
| Input path | /wek/inputs |
| **# inputs** | **136** |
| Outputs path | /wek/outputs |
| **# outputs** | **1** |
| Host | localhost |
| Output port | 12000 |
| **Type** | **All classifiers (default settings)** |
| **with** | **3 classes** |

Insgesamt liefert uns die *Face-API* 136 Positionen, welche wir als Eingabesignale (*inputs*) für das Training des Modells verwenden. Als Ausgabe wollen wir eine Klassifizierung, was einer Ausgabe (*outputs*) von 1 entspricht.

## Das Experiment starten

Das Experiment starten wir nun wie gewohnt über npm:

```bash
cd C:\Projekt\Ordner
npm start
```

Danach ist die Übung über einen Webbrowser der Wahl unter folgender Addresse erreichbar:
[http://localhost:1234](http://localhost:1234)

### Trainieren

1. Wähle entsprechend des Experiments *Wekinator-Start* eine Klasse im `outputs-1` Dropdown des Wekinators
![Wekinator Train](./images/wekinator-train.png)
2. Mache den Gesichtsausdruck der trainiert werden soll
3. Drücke in der Website auf `Record Face` - es werden ~5 Bilder pro Sekunde an Wekinator gesendet und dort gespeichert
4. Wenn du für alle 3 Klassen ~25 Bilder aufgezeichnet hast, klicke in Wekinator auf `Train` um das Modell zu trainieren
![Wekinator Trained](./images/wekinator-trained.png)

### Starten

Starte die Erkennung über die Webseite, indem du auf `Prediction` klickst.

## Aufgaben

1. Bringe die Übung zum Laufen und trainiere das Model auf die drei Emotionen

2. Füge eine weitere Emotion hinzu
    * Aktualisiere das Wekinator Projekt und füge eine weitere Klasse hinzu
    * Im Ordner `public/images` muss eine neue Datei mit dem Namen `4.gif` hinterlegt werden
    * Vergiss nicht, die Klasse zu trainieren
