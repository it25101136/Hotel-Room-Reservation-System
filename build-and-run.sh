#!/usr/bin/env bash
# Aurum Hotel Backend - Build & Run script
set -e

cd "$(dirname "$0")"

echo "🏨  AURUM HOTEL — Compiling Java backend..."
mkdir -p out

# Compile every .java file under src/
find src -name "*.java" > sources.txt
javac -d out @sources.txt
rm sources.txt

echo "✓  Compilation successful."
echo "🚀  Launching Aurum Hotel Management System..."
echo
java -cp out Main
