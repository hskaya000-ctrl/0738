#!/bin/bash
echo "Starting Freelancer Finans Takip (Offline Mode)"
cd "$(dirname "$0")/frontend/build"
python3 -m http.server 8080