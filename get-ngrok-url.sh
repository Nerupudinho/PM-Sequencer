#!/bin/bash

# Get ngrok HTTPS URL from API

echo "Waiting for ngrok API..."
sleep 5

for i in {1..10}; do
  URL=$(curl -s http://127.0.0.1:4040/api/tunnels 2>/dev/null | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    tunnels = data.get('tunnels', [])
    https_tunnel = next((t for t in tunnels if t.get('proto') == 'https'), None)
    if https_tunnel:
        print(https_tunnel['public_url'])
except:
    pass
" 2>/dev/null)
  
  if [ ! -z "$URL" ]; then
    echo "$URL"
    exit 0
  fi
  
  sleep 2
done

echo "Could not get ngrok URL. Make sure ngrok is running: ngrok http 3000"
exit 1
