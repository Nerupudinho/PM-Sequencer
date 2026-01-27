#!/bin/bash

# Complete HTTPS Development Setup Script
# This script helps you set up ngrok and configure everything

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "🔐 HTTPS Development Setup for OAuth"
echo "======================================"
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok is not installed."
    echo "   Install it with: brew install ngrok"
    exit 1
fi

echo "✅ ngrok is installed"
echo ""

# Check if dev server is running on port 3000
if ! lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Warning: No process found on port 3000"
    echo "   Make sure your Next.js dev server is running: npm run dev"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📋 Instructions:"
echo "   1. ngrok will start in a moment"
echo "   2. Look for a line like: Forwarding  https://abc123.ngrok.io -> http://localhost:3000"
echo "   3. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)"
echo "   4. Press Ctrl+C to stop ngrok when you're done"
echo ""
read -p "Press Enter to start ngrok..."
echo ""

# Start ngrok
echo "🚀 Starting ngrok..."
echo ""
ngrok http 3000
