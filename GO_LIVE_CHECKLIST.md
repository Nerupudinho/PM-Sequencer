# Go Live Checklist - PM Sequence GSAP

**Production URL**: `[YOUR_NETLIFY_URL]`

---

## Step 1: Generate NEXTAUTH_SECRET

- [x] Open terminal
- [x] Run: `openssl rand -base64 32`
- [x] Copy the generated secret (you'll need it in Step 3)
- [x] Generated secret: `[SECRET_REMOVED]`

---

## Step 2: Configure Google OAuth

- [x] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [x] Navigate: APIs & Services → Credentials → Your OAuth Client
- [x] **Authorized JavaScript origins**: Added `https://pm-monk.netlify.app`
  - Kept `http://localhost:3000` and `http://localhost:3001` for local testing
- [x] **Authorized redirect URIs**: Added `https://pm-monk.netlify.app/api/auth/callback/google`
  - Kept localhost callbacks for local testing
- [x] Go to: APIs & Services → OAuth consent screen
- [x] Check **Publishing status**: "In production" ✅

---

## Step 3: Add Environment Variables to Netlify

- [x] Go to Netlify Dashboard → Your Site → Site Settings → Environment Variables
- [x] Added all 6 required environment variables:

**Variable 1:**
- [x] Name: `DATABASE_URL` ✅
- [x] Value: Pooler URL with port 6543 ✅

**Variable 2:**
- [x] Name: `NEXTAUTH_URL` ✅
- [x] Value: `[YOUR_NETLIFY_URL]` ✅

**Variable 3:**
- [x] Name: `NEXTAUTH_URL_INTERNAL` ✅
- [x] Value: `[YOUR_NETLIFY_URL]` ✅

**Variable 4:**
- [x] Name: `NEXTAUTH_SECRET` ✅
- [x] Value: Set and marked as secret ✅

**Variable 5:**
- [x] Name: `GOOGLE_CLIENT_ID` ✅
- [x] Value: Set ✅

**Variable 6:**
- [x] Name: `GOOGLE_CLIENT_SECRET` ✅
- [x] Value: Set and marked as secret ✅

**Optional Variables (won't break if missing):**
- [x] `NEXT_PUBLIC_SUBSTACK_URL` = `https://sreesaiganesh.substack.com` ✅
- [x] `NEXT_PUBLIC_CLARITY_PROJECT_ID` = `v6zecvji77` (for Microsoft Clarity analytics) ✅

---

## Step 4: Verify Code & Build Locally

- [ ] Open terminal in project folder: `cd "/Users/nerupudinho/Downloads/The Cursor way/Initatives/pm-in-the-loop/code/pm-sequence-gsap"`
- [ ] Run: `npm run build`
- [ ] Check: Build succeeds with no errors
- [ ] Run: `npm run lint`
- [ ] Check: No linter errors
- [ ] Run: `npm run dev`
- [ ] Check: Site loads locally at `http://localhost:3000`

---

## Step 5: Commit & Push Code (if using Git auto-deploy)

- [ ] Check: Code is committed to Git
- [ ] Run: `git push` (or push through your Git client)
- [ ] Check: Code is pushed to repository

**OR if not using Git:**

- [ ] Skip to Step 6 (Manual Deploy)

---

## Step 6: Deploy to Netlify

**Option A: Git Auto-Deploy (if you pushed in Step 5)**
- [ ] Go to Netlify Dashboard → Deploys
- [ ] Check: New deploy started automatically
- [ ] Wait: 2-5 minutes for build to complete
- [ ] Check: Build status shows "Published" or "Ready"

**Option B: Manual Deploy (if not using Git)**
- [ ] Go to Netlify Dashboard → Deploys
- [ ] Click: "Trigger deploy" → "Deploy site"
- [ ] Wait: 2-5 minutes for build to complete
- [ ] Check: Build status shows "Published" or "Ready"

---

## Step 7: Verify Site Loads

- [ ] Visit: `https://pm-monk.netlify.app`
- [ ] Check: Site loads without errors
- [ ] Check: No console errors in browser (open DevTools → Console)
- [ ] Check: Site is responsive (test on mobile/desktop)

---

## Step 8: Test Database Connection

- [ ] Visit: `https://pm-monk.netlify.app/api/health` (if exists)
- [ ] Check: Should show `{"ok": true, "database": "connected"}`
- [ ] If shows `"database": "disconnected"` → Go back to Step 3 and verify `DATABASE_URL`

---

## Step 9: Test SSO Login

- [ ] Visit: `https://pm-monk.netlify.app`
- [ ] Click: "Sign in with Google"
- [ ] Complete: Google login flow
- [ ] Check: You're logged in successfully
- [ ] Go to: Supabase Dashboard → Table Editor → `User` table
- [ ] Check: Your email appears in the table

---

## Step 10: Test All Features

- [ ] Test: Swipe interface works (drag/swipe cards)
- [ ] Test: Sequence player works (video playback)
- [ ] Test: Subscription form works (`/api/subscribe`)
- [ ] Test: Animations are smooth
- [ ] Test: All navigation flows work

---

## ✅ You're Live!

If all steps above are checked, your site is live and working! 🎉

---

## 🚨 Troubleshooting

### If SSO login fails / "redirect_uri_mismatch"
- [ ] Go back to Step 2
- [ ] Verify redirect URI matches EXACTLY: `https://pm-monk.netlify.app/api/auth/callback/google`
- [ ] Verify `NEXTAUTH_URL` in Netlify is `https://pm-monk.netlify.app` (no trailing slash)
- [ ] Verify OAuth consent screen is "In production"

### If database errors occur
- [ ] Go back to Step 3
- [ ] Verify `DATABASE_URL` uses pooler URL (port 6543, not 5432)
- [ ] Check Supabase project is active (not paused)
- [ ] Test health endpoint: `/api/health`

### If site won't load / 500 errors
- [ ] Check Netlify build logs: Deploys → Latest deploy → Build log
- [ ] Go back to Step 3: Verify all 6 environment variables are set
- [ ] Check for Prisma errors in build log

### Rollback Plan
- [ ] Go to Netlify Dashboard → Deploys
- [ ] Find previous working deploy
- [ ] Click "Publish deploy"

---

## 🔧 Quick Reference Commands

```bash
# Generate NEXTAUTH_SECRET (Step 1)
openssl rand -base64 32

# Check environment variables from local file
cd "/Users/nerupudinho/Downloads/The Cursor way/Initatives/pm-in-the-loop/code/pm-sequence-gsap"
cat .env.local | grep DATABASE_URL
cat .env.local | grep GOOGLE_CLIENT_ID
cat .env.local | grep GOOGLE_CLIENT_SECRET
```
