# Simple Production Deployment Guide
## For Non-Technical Users

**Goal**: Deploy SSO login to production without breaking anything.

---

## Before You Start (5 minutes)

### Step 1: Get Your Production URLs
- **Your Netlify site URL**: `[YOUR_NETLIFY_URL]`
- **Your Supabase connection string**: 
  - **Pooler URL (port 6543)**: Get from Supabase Dashboard → Settings → Database → Connection Pooling
  - **Note**: Password `Monisha@123` is URL-encoded as `Monisha%40123` (the `@` becomes `%40`)
  - **IMPORTANT**: Use this pooler URL (port 6543), NOT direct connection (port 5432)

### Step 2: Generate Secret Key
Open terminal, go to project folder, and run:
```bash
openssl rand -base64 32
```
Copy the result (you'll need it for `NEXTAUTH_SECRET`).

---

## Part 1: Set Up Netlify (10 minutes)

### Step 1: Add Environment Variables
1. Go to Netlify Dashboard → Your Site → Site Settings → Environment Variables
2. Click "Add variable" for each:


| Variable Name | Value | Where to Get |
|--------------|-------|--------------|
| `DATABASE_URL` | `[Get from Supabase Dashboard - Connection Pooling]` | Pooler URL (port 6543) - password URL-encoded |
| `NEXTAUTH_URL` | `[YOUR_NETLIFY_URL]` | Your production Netlify URL |
| `NEXTAUTH_URL_INTERNAL` | `[YOUR_NETLIFY_URL]` | Same as NEXTAUTH_URL |
| `NEXTAUTH_SECRET` | `yCuJlP7wjuFh/TERh01K6hTAX7uTnkANPRlKKdKaKAs=` | Terminal: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console | Google Cloud → APIs & Services → Credentials → Your OAuth Client |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console | Same as above (OAuth Client) |

3. Mark `NEXTAUTH_SECRET` and `GOOGLE_CLIENT_SECRET` as "Encrypted"

---

## Part 2: Update Google OAuth (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials → Your OAuth Client (the one you're using)
3. **Authorized JavaScript origins**: 
   - Click "Add URI"
   - Add: `[YOUR_NETLIFY_URL]`
   - **Remove** all localhost, ngrok, and cloudflare tunnel URLs
4. **Authorized redirect URIs**:
   - Click "Add URI"
   - Add: `[YOUR_NETLIFY_URL]/api/auth/callback/google`
   - **Remove** all localhost, ngrok, and cloudflare tunnel URLs
5. **OAuth consent screen**:
   - Go to APIs & Services → OAuth consent screen
   - **Publishing status**: Must be "In production" (not "Testing")
   - If it says "Testing", click "PUBLISH APP" button

---

## Part 3: Check Supabase (2 minutes)

1. ✅ Pooler URL obtained: Get from Supabase Dashboard → Settings → Database → Connection Pooling
2. **Use this pooler URL** in Netlify `DATABASE_URL` variable
   - **DO NOT** use the direct connection (port 5432) - it will break in production
   - **Note**: Password is URL-encoded (`Monisha@123` → `Monisha%40123`)

---

## Part 4: Deploy (5 minutes)

1. **If using Git**:
   - Push your code: `git push`
   - Netlify will auto-deploy

2. **If not using Git**:
   - Go to Netlify Dashboard → Deploys
   - Click "Trigger deploy" → "Deploy site"
   - Or drag & drop your project folder

3. **Wait for build to complete** (2-5 minutes)
   - Watch the build logs
   - Should see "Build succeeded"

---

## Part 5: Test (5 minutes)

### Test 1: Site Works
- [ ] Visit your Netlify URL
- [ ] Site loads (no errors)

### Test 2: Health Check
- [ ] Visit `https://pm-monk.netlify.app/api/health`
- [ ] Should show: `{"ok": true, "database": "connected"}`
- [ ] If it shows `"database": "disconnected"` → Check `DATABASE_URL` in Netlify

### Test 3: SSO Login
- [ ] Click "Sign in with Google"
- [ ] Complete Google login
- [ ] You're logged in

### Test 4: Verify Data Saved
- [ ] Go to Supabase Dashboard → Table Editor → `User` table
- [ ] Your email should appear there

---

## If Something Breaks

### Quick Rollback
1. Netlify Dashboard → Deploys
2. Find previous working deploy
3. Click "Publish deploy"

### Common Issues

**"Can't sign in" / "redirect_uri_mismatch"**
- Google OAuth redirect URI must match EXACTLY: `[YOUR_NETLIFY_URL]/api/auth/callback/google`
- Check `NEXTAUTH_URL` in Netlify is set to `[YOUR_NETLIFY_URL]` (no trailing slash)
- Verify Google OAuth consent screen is "In production" (not "Testing")

**"Database error" / "Can't reach database"**
- Check `DATABASE_URL` uses pooler URL (port 6543, not 5432)
- Verify Supabase project is active (not paused)
- Test health endpoint: `/api/health`

**"Site won't load" / 500 errors**
- Check Netlify build logs (Deploys → Latest deploy → Build log)
- Verify all 6 environment variables are set
- Check for Prisma errors in build log

---

## Checklist Before Going Live

- [ ] All 6 environment variables set in Netlify
- [ ] Google OAuth has production URLs (no localhost)
- [ ] Supabase pooler URL used (not direct connection)
- [ ] Site builds successfully on Netlify
- [ ] Health check works (`/api/health`)
- [ ] SSO login works end-to-end
- [ ] User email appears in Supabase

**If all checked → You're ready for production!**
