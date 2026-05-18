@echo off
REM ============================================
REM  AURUM HOTEL - One-click website launcher
REM  Just double-click this file!
REM ============================================

cd /d "%~dp0"

echo.
echo ============================================
echo   AURUM HOTEL - Starting Website...
echo ============================================
echo.

REM Install dependencies if node_modules is missing
if not exist "node_modules" (
    echo Installing dependencies for the first time...
    call npm install
)

REM Open browser after 4 seconds (give Vite time to start)
start "" cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:5173"

REM Start Vite dev server (this keeps running)
echo.
echo Starting Vite dev server on http://localhost:5173 ...
echo Close this window to stop the server.
echo.
call npm run dev
