#!/usr/bin/env bash
# ============================================
#  AURUM HOTEL - One-click website launcher
#  For Mac / Linux. Make executable: chmod +x start-website.sh
# ============================================

cd "$(dirname "$0")"

echo
echo "============================================"
echo "  AURUM HOTEL - Starting Website..."
echo "============================================"
echo

# Install dependencies if missing
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies for the first time..."
    npm install
fi

# Open browser after Vite starts (works on Mac/Linux)
( sleep 4 && (open http://localhost:5173 2>/dev/null || xdg-open http://localhost:5173 2>/dev/null) ) &

echo
echo "Starting Vite dev server on http://localhost:5173 ..."
echo "Press Ctrl+C to stop."
echo
npm run dev
