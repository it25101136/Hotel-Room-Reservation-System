@echo off
REM Aurum Hotel Backend - Build & Run script (Windows)
cd /d "%~dp0"

echo Compiling Java backend...
if not exist out mkdir out

dir /s /b src\*.java > sources.txt
javac -d out @sources.txt
del sources.txt

if errorlevel 1 (
    echo Compilation failed.
    exit /b 1
)

echo Launching Aurum Hotel Management System...
echo.
java -cp out Main
