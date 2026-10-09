#!/bin/bash
# ==============================================================================
# Metamorphosis Student Academic Performance Tracker - Run C++ Crow Server
# ==============================================================================

PORT=${1:-8080}
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
BINARY="$SCRIPT_DIR/build/tracker_server"

if [ ! -f "$BINARY" ]; then
    echo "Binary not found at $BINARY"
    echo "Running build_macos.sh first..."
    "$SCRIPT_DIR/build_macos.sh"
fi

echo "Starting Crow REST C++ Server on port $PORT..."
"$BINARY" "$PORT"
