# How to Find Environment Variables for Netlify

## Quick Method: Extract from Local File

Your values are already in `.env.local`. Here's how to get them:

### Option 1: View in Terminal (Safest)

```bash
cd "/Users/nerupudinho/Downloads/The Cursor way/Initatives/pm-in-the-loop/code/pm-sequence-gsap"
cat .env.local | grep DATABASE_URL
cat .env.local | grep GOOGLE_CLIENT_ID
cat .env.local | grep GOOGLE_CLIENT_SECRET
```

### Option 2: Open File Directly

Open `.env.local` in your editor and copy the values.

---

## 1. DATABASE_URL (Supabase Pooler URL)

**✅ Pooler URL obtained:**
- `postgresql://postgres.npktknoqdivjlwpgjvtb:Monisha%40123@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres`
- **Note**: Password `Monisha@123` is URL-encoded as `Monisha%40123` (the `@` becomes `%40`)

**⚠️ IMPORTANT**: Use this **Connection Pooler URL** (port 6543), NOT the direct connection (port 5432).

**Why Pooler?** Netlify Functions need connection pooling to avoid exhausting database connections.

---

## 2. GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET

### Steps to Find:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select your project** (or create one if you don't have it)
3. **Navigate**: APIs & Services → Credentials
4. **Find your OAuth 2.0 Client ID** (or create one):
   - Click on the OAuth client you're using
   - You'll see:
     - **Client ID**: Looks like `123456789-abc123def456.apps.googleusercontent.com`
     - **Client Secret**: A random string (click "Show" to reveal)

### If You Don't Have OAuth Credentials:

1. **APIs & Services → Credentials**
2. **Click "Create Credentials" → "OAuth client ID"**
3. **Application type**: "Web application"
4. **Name**: Give it a name (e.g., "PM Monk Production")
5. **Authorized JavaScript origins**: 
   - Add: `https://pm-monk.netlify.app`
6. **Authorized redirect URIs**:
   - Add: `https://pm-monk.netlify.app/api/auth/callback/google`
7. **Click "Create"**
8. **Copy the Client ID and Client Secret**

---

## Quick Checklist for Netlify

Once you have all values, add them to Netlify:

- [ ] `DATABASE_URL` = `postgresql://postgres.npktknoqdivjlwpgjvtb:Monisha%40123@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres`
- [ ] `NEXTAUTH_URL` = `https://pm-monk.netlify.app`
- [ ] `NEXTAUTH_URL_INTERNAL` = `https://pm-monk.netlify.app`
- [ ] `NEXTAUTH_SECRET` = `yCuJlP7wjuFh/TERh01K6hTAX7uTnkANPRlKKdKaKAs=`
- [ ] `GOOGLE_CLIENT_ID` = (from Google Cloud Console)
- [ ] `GOOGLE_CLIENT_SECRET` = (from Google Cloud Console)

---

## Need Help?

If you can't find these values:
1. Check your `.env.local` file first (they might already be there)
2. For Supabase: Make sure you're logged into the correct project
3. For Google: Make sure you're in the correct Google Cloud project
