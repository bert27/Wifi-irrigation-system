@echo off
setlocal

:: Wifi Irrigation System - Startup Script for Windows

echo Starting Wifi Irrigation System Setup...

:: Check for node_modules in client
if not exist "client\node_modules\" (
    echo Installing client dependencies...
    cd client
    call npm install
    cd ..
) else (
    echo Client dependencies already installed.
)

:: Check for node_modules in mock server
if not exist "server\mock\node_modules\" (
    echo Installing server/mock dependencies...
    cd server\mock
    call npm install
    cd ..
) else (
    echo Server dependencies already installed.
)

echo Launching Frontend and Mock Server in separate windows...

:: Start the mock server in a new window
echo Starting Mock Server...
start "WIFI-IRRIGATION: Mock Server" cmd /k "cd server\mock && npm start"

:: Start the frontend developer server
echo Starting Frontend...
cd client
npm run dev

pause
