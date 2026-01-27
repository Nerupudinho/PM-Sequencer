#!/bin/bash

# Complete setup script - updates .env.local and provides Google Console instructions

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

if [ -z "$1" ]; then
    echo "Usage: ./complete-setup.sh <ngrok-https-url>"
    echo ""
    echo "Example:"
    echo "  ./complete-setup.sh https://abc123.ngrok.io"
    echo ""
    echo "To get your ngrok URL:"
    echo "  1. Run: ./setup-https-dev.sh"
    echo "  2. Copy the HTTPS URL from ngrok output"
    echo "  3. Run this script with that URL"
    exit 1
fi

NGROK_URL="$1"

# Validate URL format
if [[ ! "$NGROK_URL" =~ ^https:// ]]; then
    echo "❌ Error: URL must start with https://"
    echo "   Example: https://abc123.ngrok.io"
    exit 1
fi

echo "🔧 Updating configuration..."
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found!"
    echo "   Please create it first with your environment variables"
    exit 1
fi

# Update NEXTAUTH_URL
if grep -q "^NEXTAUTH_URL=" .env.local; then
    # Update existing
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=$NGROK_URL|" .env.local
    else
        sed -i "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=$NGROK_URL|" .env.local
    fi
    echo "✅ Updated NEXTAUTH_URL in .env.local"
else
    # Add if doesn't exist
    echo "NEXTAUTH_URL=$NGROK_URL" >> .env.local
    echo "✅ Added NEXTAUTH_URL to .env.local"
fi

echo ""
echo "✅ Configuration updated!"
echo ""
echo "📝 Next Steps:"
echo "=============="
echo ""
echo "1. Update Google Cloud Console:"
echo "   Go to: https://console.cloud.google.com/apis/credentials"
echo "   Select your OAuth 2.0 Client ID"
echo ""
echo "   Add to 'Authorized JavaScript origins':"
echo "   → $NGROK_URL"
echo ""
echo "   Add to 'Authorized redirect URIs':"
echo "   → $NGROK_URL/api/auth/callback/google"
echo ""
echo "2. Restart your dev server (if running):"
echo "   npm run dev"
echo ""
echo "3. Test OAuth:"
echo "   Visit: $NGROK_URL"
echo "   Click 'Sign in with Google'"
echo ""
echo "🎉 Setup complete! OAuth should now work with HTTPS."
