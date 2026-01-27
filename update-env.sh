#!/bin/bash

# Update .env.local with ngrok URL

if [ -z "$1" ]; then
  echo "Usage: ./update-env.sh <ngrok-https-url>"
  echo "Example: ./update-env.sh https://abc123.ngrok.io"
  exit 1
fi

NGROK_URL="$1"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
  echo "❌ .env.local not found. Please create it first."
  exit 1
fi

# Update NEXTAUTH_URL
if grep -q "NEXTAUTH_URL=" .env.local; then
  # Update existing NEXTAUTH_URL
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|NEXTAUTH_URL=.*|NEXTAUTH_URL=$NGROK_URL|" .env.local
  else
    # Linux
    sed -i "s|NEXTAUTH_URL=.*|NEXTAUTH_URL=$NGROK_URL|" .env.local
  fi
  echo "✅ Updated NEXTAUTH_URL to: $NGROK_URL"
else
  # Add NEXTAUTH_URL if it doesn't exist
  echo "NEXTAUTH_URL=$NGROK_URL" >> .env.local
  echo "✅ Added NEXTAUTH_URL: $NGROK_URL"
fi

echo ""
echo "📝 Next steps:"
echo "1. Update Google Cloud Console:"
echo "   - Authorized JavaScript origins: $NGROK_URL"
echo "   - Authorized redirect URIs: $NGROK_URL/api/auth/callback/google"
echo ""
echo "2. Restart your dev server: npm run dev"
echo ""
echo "3. Visit $NGROK_URL to test OAuth"
