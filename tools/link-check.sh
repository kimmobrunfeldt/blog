cp -r output/ .tmp/output-links/

zx tools/massReplace.mjs '.tmp/output-links/**/*.html' --find 'https?:\/\/kimmo\.blog' --replace 'http://localhost:12345'

http-server .tmp/output-links -p 12345 &
PID=$!

trap "kill $PID" 0

wait-port 12345
linkinator -r http://localhost:12345
