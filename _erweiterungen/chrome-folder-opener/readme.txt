00. Ladet den Ordner "chrome-folder-opener" herunter und verschiebt ihn an einen festen Speicherort eurer Wahl (zB. in euren Benutzerordner oder Dokumente).
    Achtung: Nach Abschluss der Einrichtung darf der Ordner nicht mehr verschoben oder umbenannt werden, da sonst die Verknüpfungen nicht mehr funktionieren, da die pfade abosult sind.

Chrome:
01. Öffne Chrome.
02. Gib in die Adresszeile "chrome://extensions/" ein (oder öffne deine Erweiterungsübersicht).
03. Aktiviere oben rechts den Entwicklermodus.
04. Klicke oben links auf "Entpackte Erweiterung laden".
05. Wähle den Ordner "extension", innerhalb des Ordners "chrome-folder-opener", aus.
06. Kopiere die Erweiterungs-ID der "Copy-Buttons (Folder-Extension)" aus der Übersicht.

Visual Studio Code:
07. Öffne den Ordner "chrome-folder-opener" als neues Projekt in Visual Studio Code.
08. Öffne die Datei "folder_opener.json".
09. Ersetze den Platzhalter <DEINE_EXTENSION_ID> mit der kopierten Erweiterungs-ID.
    Beispiel:
        "chrome-extension://superkickerfullnicediggalul/"

Windows Explorer:
10. Öffne den Ordner "native_host" im Windows Explorer.
11. Halte die Umschalttaste (Shift) gedrückt und rechtsklicke auf die Datei "folder_opener.exe".
12. Wähle "Als Pfad kopieren" aus dem Kontextmenü.

Visual Studio Code (erneut):
13. Öffne erneut die Datei "folder_opener.json" in Visual Studio Code.
14. Ersetze hinter "path" den Platzhalter <PFAD_ZUR_FOLDER_OPENER.EXE> mit dem kopierten Pfad.
    Achte darauf, dass zwei umgekehrte Schrägstriche (\\) verwendet werden.
    Beispiel:
        "path": "C:\\Users\\Name\\Downloads\\chrome-folder-opener\\native_host\\folder_opener.exe"

Windows Explorer (erneut):
16. Öffne den Ordner "native_host" im Windows Explorer.
17. Rechtsklicke auf die Datei "folder_opener.json".
18. Wähle "Als Pfad kopieren" aus dem Kontextmenü.
    Wenn "Als Pfad kopieren" nicht als Option angezeigt wird, versuch stadessen "Umschalttaste (Shift) gedrückt halten" und dann "rechtsklicke" auf die "folder_opener.json"-Datei.

Visual Studio Code (erneut):
19. Öffne die Datei "register_native_host.reg" in Visual Studio Code.
20. Ersetze den Platzhalter <PFAD_ZUR_FOLDER_FOLDER_OPENER.JSON> mit dem kopierten Pfad.
    Achte darauf, dass zwei umgekehrte Schrägstriche (\\) verwendet werden.
    Beispiel:
        @="C:\\Users\\Name\\Downloads\\chrome-folder-opener\\native_host\\folder_opener.json"

Die letzten Schritte:
21. Führe die Datei "register_native_host.reg" aus.
22. Starte Chrome komplett neu.