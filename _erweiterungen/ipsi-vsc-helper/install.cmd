@echo off
setlocal
title ipsi-vsc-helper Installation
set "APPDIR=%LOCALAPPDATA%\ipsi-vsc-helper"
set "STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

echo.
echo  ipsi-vsc-helper wird installiert...
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo  [FEHLER] Node.js wurde nicht gefunden.
    echo  Bitte von https://nodejs.org installieren und dieses Script erneut ausfuehren.
    echo.
    pause
    exit /b 1
)

if not exist "%APPDIR%" mkdir "%APPDIR%"

rem Laeuft bereits eine (aeltere) Instanz? -> fuer das Update beenden
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*folder-helper.js*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }" >nul 2>nul

copy /y "%~dp0folder-helper.js" "%APPDIR%\folder-helper.js" >nul

rem VBS-Starter erzeugen (startet den Helfer unsichtbar im Hintergrund)
(
  echo Set sh = CreateObject^("WScript.Shell"^)
  echo sh.Run "node ""%APPDIR%\folder-helper.js""", 0, False
) > "%APPDIR%\start-helper.vbs"

rem In den Autostart legen (startet ab sofort bei jeder Windows-Anmeldung mit)
copy /y "%APPDIR%\start-helper.vbs" "%STARTUP%\ipsi-vsc-helper.vbs" >nul

rem Helfer jetzt direkt starten
wscript "%APPDIR%\start-helper.vbs"

echo  Fertig! Der Helfer laeuft jetzt unsichtbar auf http://127.0.0.1:48620
echo  Test: http://127.0.0.1:48620/ping im Browser oeffnen.
echo.
pause
