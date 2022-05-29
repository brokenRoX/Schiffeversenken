Projektidee LabWTS
===

Full-Stack Programmierung des Spiels „Schiffe versenken“

Ziele:
1v1 Schiffeversenken gegen AI.
AI macht zufällige Züge. (werden versuchen Logik einzubauen, sodass wenn die AI ein Schiff
getroffen hat, dort weiter schießt.)
Schiffe für AI werden auch zufällig gesetzt.
Schiffe für den Spieler können beliebig gesetzt werden.
Keine “Special Moves” vorerst.
* Destroyer (2 squares):
* Submarine (3 squares):
* Cruiser (3 squares):
* Battleship (4 squares):
* Aircraft Carrier (5 squares):

Clientseitig:
Es soll eine grafische Weboberfläche erstellt werden, mit reset button, schuss button.
2 leere Spielfelder werden angezeigt. (Eines für AI und eines für Spieler)
Schiffe können per Drag’n’Drop gesetzt werden.
Schiffe vom AI werden (natürlich) nicht beim Client angezeigt.
Auf dem eigenen Feld wird angezeigt, wo die AI hingeschossen hat.

Serverseitig:
Beide Spieler (AI & Client) müssen am Server das aktuelle Spielfeld gespeichert haben.
Die AI muss sich selbst Schiffe zuweisen und deren Positionen speichern.
Wird ein Schiff getroffen speichert der Server die Position des Abschusses.
Sind alle Positionen eines Schiffs getroffen so ist das Schiff kaputt.
Sind alle Schiffe kaputt ist das Spiel zu Ende.