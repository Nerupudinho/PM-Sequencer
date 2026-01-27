# Quick Fix - Cloudflare Tunnel Expired

**Problem**: Cloudflare tunnels expire after a while. When they do, you get DNS errors.

**Solution**: Restart the tunnel and update your config.

## One-Command Fix

```bash
cd "/Users/nerupudinho/Downloads/The Cursor way/Initatives/pm-in-the-loop/code/pm-sequence-gsap"
./start-cloudflare-tunnel.sh
```

This will:
1. Start a new Cloudflare tunnel
2. Show you the new HTTPS URL
3. Tell you what to update

## Manual Steps

1. **Restart tunnel** (in a new terminal):
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

2. **Copy the HTTPS URL** (e.g., `https://person-soft-sheets-peers.trycloudflare.com`)

3. **Update `.env.local`**:
   ```bash
   ./complete-setup.sh <new-url>
   ```

4. **Update Google Console** (one-time per new URL):
   - Go to: https://console.cloud.google.com/apis/credentials
   - Update redirect URI to: `https://<new-url>/api/auth/callback/google`

5. **Restart dev server** if needed

---

**Note**: Cloudflare tunnels are free but expire. For production, use a fixed domain (Netlify/Vercel).
