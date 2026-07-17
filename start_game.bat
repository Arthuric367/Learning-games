@echo off
title Pronoun Picnic Game Server
cls
echo ========================================================
echo      Dino & Friends Pronoun Adventure - Game Server
echo ========================================================
echo.
echo 1. Make sure your iPad is on the same Wi-Fi as this PC.
echo 2. Wait for the server to start below.
echo 3. Look for the "Network" URL (e.g., http://192.168.x.x:5173).
echo 4. Type that URL into Safari on your iPad.
echo.
echo Starting server...
echo.
cd /d "%~dp0"
call npm run dev -- --host
pause
