#!/bin/bash
# ==============================================================================
# Metamorphosis Student Academic Performance Tracker - macOS Build Script
# ==============================================================================

set -e

echo "=== Metamorphosis Academic Tracker: Building C++ Backend for macOS ==="

# Check for Homebrew
if ! command -v brew &> /dev/null; then
    echo "Warning: Homebrew is not detected. If you encounter missing headers, install Homebrew from https://brew.sh"
fi

# Ensure CMake is installed
if ! command -v cmake &> /dev/null; then
    echo "CMake is required. Installing via Homebrew..."
    brew install cmake
fi

# Ensure Boost and asio are available
echo "Checking dependencies..."
if command -v brew &> /dev/null; then
    if ! brew list boost &>/dev/null; then
        echo "Installing boost via brew..."
        brew install boost
    fi
    if ! brew list asio &>/dev/null; then
        echo "Installing asio via brew..."
        brew install asio
    fi
    if ! brew list nlohmann-json &>/dev/null; then
        echo "Installing nlohmann-json via brew..."
        brew install nlohmann-json
    fi
fi

# Setup build directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

mkdir -p build
cd build

echo "Configuring with CMake..."
cmake .. -DCMAKE_BUILD_TYPE=Release

echo "Compiling targets (tracker_server & academic_calculator)..."
make -j$(sysctl -n hw.ncpu 2>/dev/null || echo 4)

echo ""
echo "=== BUILD SUCCESSFUL ==="
echo "Artifacts generated in backend/build/:"
echo "  1. tracker_server      - Crow C++ REST API Server daemon"
echo "  2. academic_calculator - Standalone C++ Engine CLI"
echo ""
echo "To run the server:"
echo "  ./backend/run_macos.sh"
echo "=========================================================="
