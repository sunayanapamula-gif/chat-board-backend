#!/bin/bash
set -e

# Install dependencies
apt-get update && apt-get install -y build-essential cmake libgomp1

# Configure and build
cmake -B build -S llama-server -DCMAKE_BUILD_TYPE=Release
cmake --build build --parallel

# Show contents for debugging
ls -R build/bin
