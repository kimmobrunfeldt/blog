#!/bin/bash

set -euo pipefail

mkdir -p output/perf

http-server .tmp/output-gz -p 12345 --gzip &
PID=$!

trap "kill $PID" 0
wait-port 12345

export CHROME_PATH="$(node -e 'console.log(require(`puppeteer`).executablePath())')"
lighthouse http://localhost:12345 \
  --throttling.cpuSlowdownMultiplier=10 \
  --chrome-flags="--no-sandbox --headless --disable-gpu" \
  --output html \
  --output-path ./output/perf/index.html

# Replace all references to localhost with the actual domain
zx tools/massReplace.mjs 'output/perf/index.html' --find 'http:\/\/localhost:12345' --replace 'https://kimmo.blog'
