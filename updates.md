Copy-Buttons Update >0.5

kein plan, was ich da angestellt habe :)

------------------------------------------------------------------------

Copy-Buttons Update 0.5

Wenn man im gleichen Fenstern ein anderes Projekt geöffnet hatte, wurde noch der alte Button angezeigt. Das ist jetzt Vergangenheit (DIE ZUKUUUNFT!). Im localStorage wird jetzt der letzte teil der ID mit eingespeichert und gecheckt, ob diese mit der ID in der URL übereinstimmt.

------------------------------------------------------------------------

Copy-Buttons Update 0.6 
 
1. Die IPSI-Projekt-Daten werden jetzt in ein localStorage-Item als object abgespeichert, anstatt wie zuvor für jeden einzelnen Punkt ein neues Itemzu erstellen.

2. Außerdem gibt's jetzt ein delete-btn, der das Projekt aus den localStorage entfernt. Würde das jedes mal machen, wenn das Projekt live gestellt wird, müsst ihr aber nicht.
 
3. UND DAS WICHTIGSTE! custom COLOOORS, als hex-code. Aber ist im Test-Stadium, also nicht wundern, wenn's weird aussieht. ich empfehle die vorgegebenen Farben zu nutzten.

------------------------------------------------------------------------

Copy-Buttons Update 0.7
 
Jetzt habt Ihr 'nen kleinen Settings-Button/-Feld "+", wo ihr 'n paar Sachen einstellen könnt.
Die Settings werden automatisch in euerem LocalStorage gespeichert. Wenn keine Settings im localStorage sind, werden die Standard Settings-Angaben aus dem code genutzt.

------------------------------------------------------------------------

Copy-Buttons Update 0.71

Es hat sich nur leicht die Animation des Setting-Fensters geändert, wenn man die Farbauswahl öffnet. Außerdem liegt der Settings-Fenster nicht mehr so weit oben...
UND: ʕ·͡ᴥ·ʔ *bup*

------------------------------------------------------------------------

Copy-Buttons Update 0.75 (15.10.24)

Settings-Button wird jetzt zusammen mit dem Copy-Button generiert und nicht erst nachdem die IPSI-Projekt-Seite refreshed wurde.
Kleine Anpassing am Styling des Setting-Feldes.

------------------------------------------------------------------------

Copy-Buttons Update 0.76 (16.10.24)

Bug-Fix: Settings-Button wurde nicht jedes mal, beim öffnen einer Projekt-Seite, generiert.

------------------------------------------------------------------------

Copy-Buttons Update 0.77 (22.10.24)

Style-Update: Abstände und Text-Größen angepasst.

------------------------------------------------------------------------

Copy-Buttons Update 0.8 (25.10.24)

- Settings im localStorage passt sich dem default-settings im code an. Wenn ein Key (Settings-Feld) im localStorage fehlt, dass aber in den default-Settings ist, werden die fehlenden Keys & Values (Settings-Felder) mit in den localStorage hinzugefügt. Gleiches für fehlende Felder. Wenn Setting-Felder im localStorage existieren, aber nicht in den default-settings, wird dies aus dem localStorage entfernt.

- Dark-Mode, (nur) für die Settings-UI, implementiert.

- Liste von allen Projekten, im localStorage (lokalen Speicher). Projekte in der Liste können durch anklicken markiert und aus dem localStorage gelöscht werden.

- Animationen und Styles angepasst.

- Laufwerk customizable, falls sich der "EDO"-Laufwerk ändert oder Ihr 'nen anderen habt (aus irgendeinem Grund).

- Und kleiner anderer Stuff. ( ͡° ͜ʖ ͡°) -hihi

------------------------------------------------------------------------

Copy-Buttons Update 0.82 (01.11.24)

- Button, der zur OTRS-Seite führt und einen Autofill startet (noch WIP und OTRS-Extension wird dafür benötigt).

- Mehrere Projektdaten werden jetzt in den Lokalen Daten gespeichert.

- Styles und Icons angepasst.

------------------------------------------------------------------------

Copy-Buttons Update 0.83 (04.11.24)

- Kleinigkeiten am OTRS-Button angepasst.

- mehr "hihi"-Content. ( ͡° ͜ʖ ͡°)

------------------------------------------------------------------------

Copy-Buttons Update 0.86 (23.05.25)

- Sehr viele Style Anpassungen.

- Es ist jetzt möglich, in der Projektübersicht, mehrere Projekte auf einmal zu markieren, wenn man den linken Mauszeiger gedrückt hält und über die Projekte hovert.

- Es gibt jetzt 3 weitere Felder:
    1. Ein Supportticket erstellen/abschicken: hier könnt ihr entweder mich kontaktieren, falls euch ein Bug auffällt, Vorschläge und/oder Ideen für den copy-button habt ODER auch wenn ihr BG kontaktieren müsst.
    2. Deine Daten angeben: vorteilhaft, wenn du die Supportticketfunktion nutzen möchtest und später auch mit der OTRS-Erweiterung kompatibel.
    3. E-Mail Client: da legt ihr nur fest, ob ihr die Outlook-App oder die Browser-Version nutzt.

------------------------------------------------------------------------

Copy-Buttons Update 0.87 (03.07.25)

- Abstand Anpassung der Copy-Buttons, aufgrund des neuen IPSI-Updates (casbar in IPSI wurde erweitert). Danke für euer Feedback~ <3
- Ebenfalls Abstand vom Success-Label angepasst.

------------------------------------------------------------------------
