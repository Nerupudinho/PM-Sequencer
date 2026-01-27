# ngrok Setup - Quick Guide

Since ngrok needs to run interactively, follow these steps:

## Step 1: Start ngrok

Open a **new terminal window** and run:

```bash
cd "/Users/nerupudinho/Downloads/The Cursor way/Initatives/pm-in-the-loop/code/pm-sequence-gsap"
ngrok http 3000
```

You'll see output like:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

**Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

## Step 2: Update Configuration

Once you have the ngrok URL, run:

```bash
./complete-setup.sh https://abc123.ngrok.io
```

This will:
- ✅ Update `.env.local` with the ngrok URL
- ✅ Show you exactly what to update in Google Cloud Console

## Step 3: Update Google Cloud Console

The script will show you the exact URLs to add. Go to:
https://console.cloud.google.com/apis/credentials

Select your OAuth 2.0 Client ID and add:
- **Authorized JavaScript origins**: Your ngrok HTTPS URL
- **Authorized redirect URIs**: Your ngrok HTTPS URL + `/api/auth/callback/google`

## Step 4: Restart Dev Server

```bash
npm run dev
```

## Step 5: Test

Visit your ngrok HTTPS URL and try signing in with Google!

---

**Note**: If ngrok URL changes (free plan), just run `./complete-setup.sh <new-url>` again.
