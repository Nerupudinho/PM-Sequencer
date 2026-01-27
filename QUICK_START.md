# Quick Start - HTTPS Development Setup

## Why HTTPS?

OAuth + PKCE requires HTTPS. HTTP localhost will NOT work due to browser security policies.

## 5-Minute Setup with ngrok

### Option A: Using Helper Scripts (Easiest)

1. **Start ngrok** (in a new terminal):
   ```bash
   ./setup-ngrok.sh
   ```

2. **Copy the HTTPS URL** from ngrok output (e.g., `https://abc123.ngrok.io`)

3. **Update `.env.local`**:
   ```bash
   ./update-env.sh https://abc123.ngrok.io
   ```

4. **Update Google Cloud Console**:
   - **Authorized JavaScript origins**: `https://abc123.ngrok.io`
   - **Authorized redirect URIs**: `https://abc123.ngrok.io/api/auth/callback/google`

5. **Restart dev server** (if running):
   ```bash
   npm run dev
   ```

6. **Test**: Visit `https://abc123.ngrok.io` → Sign in with Google → Should work! ✅

### Option B: Manual Setup

1. **Start ngrok** (in a new terminal):
   ```bash
   ngrok http 3000
   ```

2. **Copy HTTPS URL** from ngrok output

3. **Update `.env.local`**:
   ```env
   NEXTAUTH_URL=https://abc123.ngrok.io
   ```

4. **Update Google Cloud Console** (same as Option A, step 4)

5. **Restart dev server** and test

---

**Note**: ngrok URL changes on restart (free plan). Update `.env.local` and Google Console when it changes.

**Production**: This will work automatically on Netlify/Vercel (HTTPS is standard).
