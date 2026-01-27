#!/bin/bash

# Start Cloudflare Tunnel (no interstitials, better UX than ngrok free)

echo "🚀 Starting Cloudflare Tunnel (no interstitials!)..."
echo ""
echo "This will give you a clean HTTPS URL without warning pages."
echo ""

cd "$(dirname "$0")"

# Kill any existing cloudflared
pkill -f cloudflared 2>/dev/null || true

# Start tunnel
cloudflared tunnel --url http://localhost:3000 2>&1 | tee /tmp/cloudflared.log &
TUNNEL_PID=$!

echo "Waiting for tunnel to start..."
sleep 8

# Extract URL
URL=$(grep -oE "https://[a-z0-9-]+\.trycloudflare\.com" /tmp/cloudflared.log | head -1)

if [ -z "$URL" ]; then
    echo "❌ Could not get Cloudflare URL. Check /tmp/cloudflared.log"
    kill $TUNNEL_PID 2>/dev/null
    exit 1
fi

echo ""
echo "✅ Cloudflare Tunnel is running!"
echo ""
echo "📋 Your HTTPS URL: $URL"
echo ""
echo "📝 Next steps:"
echo "   1. Update .env.local:"
echo "      NEXTAUTH_URL=$URL"
echo ""
echo "   2. Update Google Cloud Console:"
echo "      Authorized JavaScript origins: $URL"
echo "      Authorized redirect URIs: $URL/api/auth/callback/google"
echo ""
echo "   3. Restart your dev server"
echo ""
echo "Press Ctrl+C to stop the tunnel"
echo ""

# Keep script running
wait $TUNNEL_PID
