0. Ladet den Ordner "**chrome-folder-opener**" herunter und verschiebt ihn an einen festen Speicherort eurer Wahl (zB. in euren Benutzerordner oder Dokumente).
    **Achtung:** Nach Abschluss der Einrichtung darf der Ordner nicht mehr verschoben oder umbenannt werden, da sonst die Verknüpfungen nicht mehr funktionieren, da die pfade abosult sind.

## Chrome:
2. Öffne Chrome.
3. Gib in die Adresszeile "`chrome://extensions/`" ein *(oder öffne deine Erweiterungsübersicht)*.
4. **Aktiviere** oben rechts den **Entwicklermodus**.
5. Klicke oben links auf "**Entpackte Erweiterung laden**".
6. Wähle den Ordner "**extension**", innerhalb des Ordners "chrome-folder-opener", aus.
7. Kopiere die **Erweiterungs-ID** der "Copy-Buttons (Folder-Extension)" aus der Erweiterungsübersicht.

## Visual Studio Code:
8. Öffne den Ordner "**chrome-folder-opener**" als neues Projekt in Visual Studio Code.
9. Öffne die Datei "**folder_opener.json**".
10. Ersetze den Platzhalter "**<DEINE_EXTENSION_ID>**" mit der kopierten Erweiterungs-ID.
    ***Beispiel:*** `chrome-extension://superkickerfullnicediggalul/`

## Windows Explorer:
11. Öffne den Ordner "**native_host**" im Windows Explorer.
12. Rechtsklicke auf die Datei "**folder_opener.exe**".
13. Wähle "**Als Pfad kopieren**" aus dem Kontextmenü.
> Wenn "Als Pfad kopieren" nicht als Option angezeigt wird, versuch
> stattdessen "Umschalttaste (Shift) gedrückt halten" und dann
> "rechtsklicke" auf die "folder_opener.json"-Datei.

## Visual Studio Code *(erneut)*:
14. Öffne erneut die Datei "**folder_opener.json**" in Visual Studio Code.
15. Ersetze hinter "path" den Platzhalter "**<PFAD_ZUR_FOLDER_OPENER.EXE>**" mit dem kopierten Pfad. Achte dabei darauf, dass zwei umgekehrte Schrägstriche (\\\\) verwendet werden.
	***Beispiel:*** `"path": "C:\\Users\\Name\\Downloads\\chrome-folder-opener\\native_host\\folder_opener.exe"`

## Windows Explorer *(erneut)*:
16. Öffne den Ordner "**native_host**" im Windows Explorer.
17. Rechtsklicke auf die Datei "**folder_opener.json**".
18. Wähle "**Als Pfad kopieren**" aus dem Kontextmenü.
> Wenn "Als Pfad kopieren" nicht als Option angezeigt wird, versuch
> stattdessen "Umschalttaste (Shift) gedrückt halten" und dann
> "rechtsklicke" auf die "folder_opener.json"-Datei.

## Visual Studio Code *(erneut)*:
19. Öffne die Datei "**register_native_host.reg**" in Visual Studio Code.
20. Ersetze den Platzhalter "**<PFAD_ZUR_FOLDER_FOLDER_OPENER.JSON>**" mit dem kopierten Pfad. Achte dabei darauf, dass zwei umgekehrte Schrägstriche (\\\\) verwendet werden.
    **Beispiel:** `@="C:\\Users\\Name\\Downloads\\chrome-folder-opener\\native_host\\folder_opener.json"`

## Die letzten Schritte:
21. Führe die Datei "**register_native_host.reg**" aus.
22. **Starte Chrome komplett neu.**
