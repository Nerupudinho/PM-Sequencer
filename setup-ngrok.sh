#!/bin/bash

# ngrok HTTPS Setup Script
# This script helps you set up ngrok for OAuth development

echo "🚀 Starting ngrok tunnel on port 3000..."
echo ""
echo "Once ngrok starts, you'll see a line like:"
echo "Forwarding  https://abc123.ngrok.io -> http://localhost:3000"
echo ""
echo "Copy the HTTPS URL (e.g., https://abc123.ngrok.io)"
echo "Then run: ./update-env.sh <your-ngrok-url>"
echo ""
echo "Press Ctrl+C to stop ngrok when done"
echo ""

ngrok http 3000
