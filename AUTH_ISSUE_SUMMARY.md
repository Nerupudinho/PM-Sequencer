# Google OAuth PKCE Cookie Issue - Technical Summary

## ✅ RESOLUTION (From Senior Engineer)

**Nothing is broken. This is expected browser + OAuth + NextAuth v5 behavior.**

### Solution: Use HTTPS in Development
- **NextAuth v5 intentionally does NOT allow PKCE cookie overrides** (security design)
- **Browsers block cross-site PKCE cookies on HTTP localhost** (modern security)
- **HTTPS is required** for OAuth + PKCE to work
- **This WILL work in production** (HTTPS is standard)

### Quick Fix: Use ngrok
```bash
ngrok http 3000
# Update NEXTAUTH_URL to ngrok HTTPS URL
# Update Google OAuth redirect URI to ngrok HTTPS URL
```

---

## Context
Building a Next.js 16 app with NextAuth v5 (Auth.js) for Google SSO authentication. Using Supabase PostgreSQL with Prisma ORM.

## Problem
**PKCE cookie not being sent back after Google OAuth redirect**, causing `InvalidCheck: pkceCodeVerifier value could not be parsed` error.

## What We've Done

### 1. Fixed PrismaClient Initialization
- Issue: PrismaClient wasn't getting `DATABASE_URL` from env
- Fix: Explicitly pass `DATABASE_URL` to PrismaClient constructor
- Status: ✅ Fixed

### 2. PKCE Cookie Configuration Attempts
- Tried overriding `cookies.pkceCodeVerifier` in NextAuth config
- Set `sameSite: 'none'`, `secure: false` for development
- **Problem**: NextAuth v5 ignores our cookie override - still sets `SameSite=Lax`
- Evidence: Log shows cookie being set with `SameSite=Lax` despite our config

### 3. Current State
- Cookie IS being set: `authjs.pkce.code_verifier` appears in Set-Cookie headers
- Cookie NOT being sent back: Missing from request cookies when Google redirects to callback URL
- Root cause: `SameSite=Lax` cookies blocked during cross-site redirects (Google → localhost)

## Technical Details

**Stack:**
- Next.js 16.0.7
- NextAuth v5 (beta.30)
- Prisma 7.3.0
- Development: HTTP localhost:3000

**Flow:**
1. User clicks "Sign in with Google"
2. POST to `/api/auth/signin/google` → Sets PKCE cookie → Redirects to Google
3. User authenticates with Google
4. Google redirects to `/api/auth/callback/google?code=...`
5. **Cookie missing** → NextAuth can't verify PKCE → Error

**Evidence from logs:**
```
Set-Cookie: authjs.pkce.code_verifier=...; SameSite=Lax  // Cookie set
Cookie header on callback: (no PKCE cookie)              // Cookie missing
```

## Attempted Solutions

1. ✅ Cookie configuration override → Not supported by NextAuth v5
2. ✅ `useSecureCookies: false` → Doesn't affect PKCE cookie
3. ✅ `runtime = 'nodejs'` → No change
4. ❌ `SameSite: 'none'` with `Secure: false` → Browsers reject this combination

## Answers from Senior Engineer

### 1. **NextAuth v5 Cookie Override**
❌ **No** - This is intentional. NextAuth v5 does NOT allow PKCE cookie overrides by design (security boundary).

### 2. **Localhost OAuth Best Practice**
✅ **Use HTTPS** - Standard options:
- ngrok (recommended)
- Cloudflare Tunnel
- local HTTPS via mkcert

### 3. **Alternative Storage**
❌ **Not viable** with NextAuth v5:
- Server session: Loses context on redirect
- Database: Race/replay risks
- URL params: Security vulnerability
- LocalStorage: Defeats PKCE security

PKCE **must** be cookie-based + HttpOnly.

### 4. **NextAuth v5 vs v4**
❌ **Don't downgrade** - v5 aligns with modern browser security. v4 "working" on HTTP is accidental, not safe.

### 5. **Production Readiness**
✅ **Yes, 100%** - Production has HTTPS, so this will work perfectly. This is dev-environment-only.

## Current Configuration

```typescript
// auth.ts
export const { auth, handlers } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  useSecureCookies: false, // For development
  providers: [GoogleProvider({ ... })],
})

// route.ts
export const runtime = 'nodejs' // Force Node.js runtime
```

## Implementation Steps

### Option 1: ngrok (Recommended - Easiest)

1. **Install ngrok**:
   ```bash
   brew install ngrok
   # OR download from https://ngrok.com
   ```

2. **Start ngrok tunnel**:
   ```bash
   ngrok http 3000
   ```

3. **Copy HTTPS URL** (e.g., `https://abc123.ngrok.io`)

4. **Update `.env.local`**:
   ```env
   NEXTAUTH_URL=https://abc123.ngrok.io
   ```

5. **Update Google Cloud Console**:
   - Add to **Authorized redirect URIs**: `https://abc123.ngrok.io/api/auth/callback/google`

6. **Restart dev server** and test

### Option 2: Cloudflare Tunnel
```bash
cloudflared tunnel --url http://localhost:3000
```

### Option 3: mkcert (Local HTTPS)
```bash
brew install mkcert
mkcert -install
mkcert localhost
# Configure Next.js to use HTTPS
```

---

**Status**: ✅ **RESOLVED** - Use HTTPS in development. This is expected behavior, not a bug.
