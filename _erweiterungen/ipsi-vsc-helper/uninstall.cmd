@echo off
setlocal
title ipsi-vsc-helper Deinstallation
set "APPDIR=%LOCALAPPDATA%\ipsi-vsc-helper"
set "STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

echo.
echo  ipsi-vsc-helper wird entfernt...
echo.

rem Laufenden Helfer beenden (ueber die gemerkte PID)
if exist "%APPDIR%\helper.pid" set /p HELPERPID=<"%APPDIR%\helper.pid"
if defined HELPERPID taskkill /pid %HELPERPID% /f >nul 2>nul

rem Sicherheitsnetz: jeden node-Prozess beenden, der folder-helper.js ausfuehrt
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*folder-helper.js*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }" >nul 2>nul

rem Autostart-Eintrag entfernen
del /q "%STARTUP%\ipsi-vsc-helper.vbs" >nul 2>nul

rem Programmordner entfernen
rmdir /s /q "%APPDIR%" >nul 2>nul

echo  Fertig! Der Helfer wurde beendet und vollstaendig entfernt.
echo.
pause
