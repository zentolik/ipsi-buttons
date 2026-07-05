# ipsi-vsc-helper (v1.3)

Lokaler Helfer für das Copy-Buttons-Userscript: Linksklick auf den Pfad-Button
listet die Ordner im Projekt-Pfad und öffnet sie direkt in Visual Studio Code
(als neues Fenster). Rechtsklick öffnet ein Menü mit "Mit VSC öffnen" und
"Im Explorer öffnen". Ersetzt die alte "chrome-folder-opener"-Extension
komplett – keine Chrome-Erweiterung, kein Registry-Eintrag, kein
Native-Messaging mehr.

## Neu in v1.3
- **Zuverlässiger Programmstart**: VS Code/Explorer starten über das bewährte
  `cmd /c start` (Fensterstatus wird explizit auf "normal" gesetzt). Der
  Rückgabewert wird geprüft – Startfehler erscheinen jetzt ehrlich als rote
  Meldung im Userscript statt eines falschen "ok". Notnagel: Direktstart.
- **Weckdienst-Log nennt den Laufwerksbuchstaben** – der stammt immer aus dem
  übergebenen Pfad, also aus der `copy_drive`-Einstellung des Userscripts
  (Standard: A).

## Neu in v1.2
- **Geduldiger Netzlaufwerk-Weckdienst**: Der Helfer probiert jetzt bis zu
  ~25 Sekunden abwechselnd Laufwerksbuchstabe und UNC-Pfad – ein aufwachendes
  NAS braucht gerne 10–30 Sekunden, so lange wartet der Explorer schließlich
  auch. Echte "Ordner existiert nicht"-Fälle werden weiterhin in unter einer
  Sekunde erkannt. Das Userscript zeigt währenddessen einen kurzen Hinweis
  ("Laufwerk wird geweckt…").
- **UNC-Ermittlung über drei Quellen**: Registry (`HKCU\Network`), `net use`
  und `Get-SmbMapping`.
- **Aussagekräftigere Fehlermeldungen**: "Pfad nicht gefunden" nennt jetzt den
  Grund (z.B. "Ordner existiert dort nicht" vs. "Server nicht erreichbar").
- **Neue Diagnose-Route `/diag`** für die Fehlersuche (siehe unten).

## Neu in v1.1
- **VS Code startet jetzt auch, wenn es vorher geschlossen war** – der Start
  läuft über PowerShell/Start-Process mit erzwungenem sichtbarem Fenster
  (vorher konnte die neue VSC-Hauptinstanz den unsichtbaren Fensterstatus
  des Autostart-Helfers erben und blieb dann ohne Fenster).
- **Neue Route /open-explorer** – öffnet den Projekt-Pfad als Ordner im
  Windows-Explorer (für das Rechtsklick-Menü des Pfad-Buttons).
- **Netzlaufwerk-Weckdienst** – "Nicht verbundene" Netzlaufwerke werden
  automatisch wiederverbunden: Der Helfer ermittelt das UNC-Ziel des
  Laufwerksbuchstabens (Registry bzw. `net use`), baut die Verbindung mit
  den gespeicherten Anmeldedaten auf und bedient die Anfrage notfalls
  transparent über den UNC-Pfad. Manuelles Anklicken des Laufwerks entfällt.
  Der erste Klick nach längerer Pause kann dadurch 2–5 Sekunden dauern.

## Voraussetzungen
- Windows
- Node.js (https://nodejs.org) – `node` muss im PATH sein
- Visual Studio Code

## Installation / Update
1. `install.cmd` doppelklicken.
   - Beendet eine evtl. laufende ältere Instanz (Update)
   - Kopiert den Helfer nach `%LOCALAPPDATA%\ipsi-vsc-helper`
   - Legt einen unsichtbaren Autostart an (startet bei jeder Windows-Anmeldung)
   - Startet den Helfer sofort
2. Test: `http://127.0.0.1:48620/ping` im Browser öffnen → es sollte JSON mit
   `"version":"1.3"` erscheinen.
3. Im Copy-Buttons-Settings-Panel den Schalter **"VSC-Ordner-Öffner"** aktivieren.

Hinweis: Beim allerersten Klick kann Chrome einmalig fragen, ob die ipsi-Seite auf
"Geräte im lokalen Netzwerk" zugreifen darf → **Zulassen**. Das ist die Verbindung
zum Helfer auf 127.0.0.1.

## Routen
- `GET /ping` → Lebenszeichen
- `GET /scan?path=...` → listet Unterordner (inkl. Weckdienst für Netzlaufwerke)
- `GET /diag?path=...` → Schritt-für-Schritt-Diagnose des Weckdienstes
- `POST /open` → startet `Code.exe --new-window <Ordner>` (sichtbar)
- `POST /open-explorer` → öffnet den Ordner im Windows-Explorer

## Fehlersuche
Klappt das Aufwecken eines Laufwerks nicht, im Browser aufrufen (Pfad anpassen):

    http://127.0.0.1:48620/diag?path=L:\EDO\pandava\123456\work\

Die Antwort zeigt jeden Versuch des Weckdienstes (stat/anstupsen, Dauer,
Fehlercode) sowie das ermittelte UNC-Ziel – dieses JSON hilft bei der Analyse.

## Sicherheit
- Lauscht nur auf 127.0.0.1 (von außen nicht erreichbar)
- Akzeptiert nur Anfragen von https://ipsi.securewebsystems.net
- Nimmt nur saubere, absolute Windows-Pfade an; Pfade wandern nie durch eine
  Shell, sondern nur als Argumente bzw. über Umgebungsvariablen
- Die einzige Grenze des Weckdienstes: Wenn Windows keine Anmeldedaten für das
  Laufwerk gespeichert hätte und beim Verbinden nach einem Passwort fragen
  würde. (Reicht bei dir ein Klick im Explorer, sind die Daten gespeichert.)

## Deinstallation
`uninstall.cmd` doppelklicken – beendet den Helfer, entfernt Autostart und
`%LOCALAPPDATA%\ipsi-vsc-helper` vollständig.

## Falls VS Code nicht gefunden wird
Der Helfer sucht Code.exe automatisch (LocalAppData, Program Files, PATH).
Falls das fehlschlägt: in `folder-helper.js` oben bei `CODE_PATH_OVERRIDE`
den vollständigen Pfad zur Code.exe eintragen und `install.cmd` erneut ausführen.
