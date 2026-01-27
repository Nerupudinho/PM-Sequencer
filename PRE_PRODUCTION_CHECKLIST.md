# Pre-Production Verification & Deployment Guide
## SSO Authentication + Supabase Integration

**Purpose**: Comprehensive checklist and procedures to ensure SSO and Supabase integration work correctly in production (Netlify) before going live.

**Review Required**: Senior Architect to validate all checkpoints and procedures.

---

## Part 1: Pre-Production Verification Checklist

### ✅ Environment Variables Configuration

#### 1.1 Netlify Environment Variables
**Location**: Netlify Dashboard → Site Settings → Environment Variables

**Required Variables**:
- [ ] `DATABASE_URL` - Supabase PostgreSQL connection string
  - Format: `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`
  - **Verification**: Must match Supabase project connection string exactly
- [ ] `NEXTAUTH_URL` - Production URL
  - Format: `https://your-site.netlify.app` (or custom domain)
  - **Verification**: Must match deployed site URL exactly (no trailing slash)
- [ ] `NEXTAUTH_SECRET` - Random secret key
  - Format: Generated via `openssl rand -base64 32`
  - **Verification**: Must be set and different from development secret
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth Client ID
  - Format: `[numbers]-[string].apps.googleusercontent.com`
  - **Verification**: Must be from production OAuth credentials (not test credentials)
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
  - Format: Random string provided by Google
  - **Verification**: Must match the Client ID's secret
- [ ] `NEXTAUTH_URL_INTERNAL` - Internal URL for Netlify (REQUIRED for Netlify)
  - Format: `https://your-site.netlify.app` (same as `NEXTAUTH_URL`)
  - **Verification**: Must match production URL exactly (no trailing slash)
  - **Why**: Netlify uses internal function URLs that differ from public site URL. Auth.js v5 needs this to correctly resolve callbacks internally and avoid silent callback failures.

**Action Items**:
1. Export all variables from `.env.local` (development)
2. Add each variable to Netlify Environment Variables
3. Verify no typos or extra spaces
4. Mark sensitive variables as "Encrypted" in Netlify

---

### ✅ Auth Cookies Verification

#### 1.2 Cookie Configuration Checkpoints
**Location**: Browser DevTools → Application → Cookies (after deployment)

**Critical Checkpoints**:
- [ ] Cookies are `__Secure-` prefixed in production (e.g., `__Secure-next-auth.session-token`)
- [ ] `secure: true` attribute is set (required for HTTPS)
- [ ] `sameSite: "lax"` (NOT `none` unless cross-domain)
- [ ] Cookie domain resolves correctly on:
  - Netlify subdomain (`your-site.netlify.app`)
  - Custom domain (if used)
- [ ] Cookies persist after page refresh
- [ ] Cookies are sent with authentication requests

**Why This Matters**:
- Google OAuth + Netlify + redirects can cause cookie drops if misconfigured
- This is a top cause of "login works but session doesn't persist"
- Cookie domain mismatches cause silent authentication failures

**Verification Method**:
1. Deploy to production
2. Open browser DevTools → Application → Cookies
3. Sign in with Google
4. Verify cookie attributes match above checkpoints

---

### ✅ Google Cloud Console Configuration

#### 2.1 OAuth Consent Screen
**Location**: Google Cloud Console → APIs & Services → OAuth consent screen

**Checkpoints**:
- [ ] **Publishing Status**: Must be "In production" (not "Testing")
- [ ] **App Name**: Matches your application name
- [ ] **User Support Email**: Valid email address
- [ ] **Developer Contact**: Valid email address
- [ ] **Scopes**: At minimum `email`, `profile`, `openid`

#### 2.2 OAuth 2.0 Client Credentials
**Location**: Google Cloud Console → APIs & Services → Credentials

**Checkpoints**:
- [ ] **Client ID**: Matches `GOOGLE_CLIENT_ID` in Netlify environment variables
- [ ] **Client Secret**: Matches `GOOGLE_CLIENT_SECRET` in Netlify environment variables
- [ ] **Application Type**: "Web application"

#### 2.3 Authorized JavaScript Origins
**Location**: OAuth 2.0 Client → Authorized JavaScript origins

**Required Origins**:
- [ ] `https://your-site.netlify.app` (production URL)
- [ ] `https://your-custom-domain.com` (if using custom domain)
- [ ] **Remove**: Any localhost or development URLs (ngrok, cloudflare tunnel)

**Verification**: Only production URLs should be listed

#### 2.4 Authorized Redirect URIs
**Location**: OAuth 2.0 Client → Authorized redirect URIs

**Required URIs**:
- [ ] `https://your-site.netlify.app/api/auth/callback/google`
- [ ] `https://your-custom-domain.com/api/auth/callback/google` (if using custom domain)
- [ ] **Remove**: All development/localhost redirect URIs

**Verification**: Must match `NEXTAUTH_URL/api/auth/callback/google` exactly

---

### ✅ Supabase Configuration

#### 3.1 Database Connection
**Location**: Supabase Dashboard → Project Settings → Database

**Checkpoints**:
- [ ] **Connection Pooling**: **REQUIRED** - Using Supabase connection pooler URL (not direct DB host)
  - **Format**: `postgresql://postgres:[password]@[pooler-host].supabase.co:6543/postgres`
  - **Why**: Netlify Functions are stateless. Prisma opens connections per invocation. Without pooling → DB connection exhaustion within hours.
  - **How to get**: Supabase Dashboard → Project Settings → Database → Connection Pooling → Connection String
- [ ] **Connection String**: Matches `DATABASE_URL` in Netlify environment variables (must be pooler URL)
- [ ] **Database Host**: Accessible from Netlify (not IP-restricted)

#### 3.2 Database Schema
**Location**: Supabase Dashboard → Table Editor

**Required Tables**:
- [ ] `User` table exists with columns:
  - `id` (String, Primary Key)
  - `email` (String, Unique)
  - `name` (String, Nullable)
  - `emailVerified` (DateTime, Nullable)
  - `image` (String, Nullable)
  - `createdAt` (DateTime)
  - `updatedAt` (DateTime)
- [ ] `Account` table exists with columns:
  - `id` (String, Primary Key)
  - `userId` (String, Foreign Key → User.id)
  - `type` (String)
  - `provider` (String)
  - `providerAccountId` (String)
  - `refresh_token`, `access_token`, `id_token` (Text, Nullable)
  - Unique constraint on `[provider, providerAccountId]`
- [ ] `Session` table exists
- [ ] `VerificationToken` table exists

**Verification Method**:
```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('User', 'Account', 'Session', 'VerificationToken');
```

#### 3.3 Row Level Security (RLS)
**Location**: Supabase Dashboard → Authentication → Policies

**Checkpoints**:
- [ ] RLS policies allow Prisma/NextAuth to read/write (if RLS is enabled)
- [ ] **Recommendation**: For NextAuth, RLS can be disabled on auth tables OR configured to allow service role access

#### 3.4 Network Access
**Checkpoints**:
- [ ] Supabase project allows connections from Netlify IPs (if IP restrictions exist)
- [ ] **Default**: Supabase allows all connections unless explicitly restricted

---

### ✅ Code Configuration

#### 4.1 Prisma Configuration
**File**: `prisma/schema.prisma`

**Checkpoints**:
- [ ] `datasource db` has `url = env("DATABASE_URL")`
- [ ] `generator client` includes `binaryTargets` for Netlify compatibility:
  ```prisma
  generator client {
    provider      = "prisma-client-js"
    binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
  }
  ```
- [ ] All required models exist (User, Account, Session, VerificationToken)
- [ ] Schema matches Supabase database structure

**Why Binary Targets Matter**:
- Netlify uses Linux ARM/x64 depending on infrastructure
- Missing binary targets cause `PrismaClientInitializationError` after successful builds
- This prevents silent runtime crashes

**Verification**:
```bash
npx prisma validate
npx prisma format
```

#### 4.2 NextAuth Configuration
**File**: `auth.ts`

**Checkpoints**:
- [ ] `adapter: PrismaAdapter(prisma)` is configured
- [ ] `GoogleProvider` uses environment variables:
  - `clientId: process.env.GOOGLE_CLIENT_ID!`
  - `clientSecret: process.env.GOOGLE_CLIENT_SECRET!`
- [ ] `NEXTAUTH_URL` is not hardcoded (uses `process.env.NEXTAUTH_URL`)
- [ ] `trustHost: true` is set (required for Netlify)
- [ ] **Debug logging enabled** for production (critical for first 48h):
  ```typescript
  debug: process.env.NODE_ENV === "production",
  logger: {
    error(code, metadata) {
      console.error(code, metadata)
    },
  }
  ```
- [ ] **Health check endpoint** created at `/api/health` (see Section 4.4)

**Why Logging Matters**:
- Without debug logging, Netlify logs are nearly useless
- OAuth issues are impossible to debug blind
- Critical for troubleshooting in first 48 hours after deployment

#### 4.3 Prisma Client
**File**: `lib/prisma.ts`

**Checkpoints**:
- [ ] Uses Prisma 6.19.1 (not 7.x)
- [ ] Singleton pattern implemented correctly
- [ ] No hardcoded database URLs

#### 4.4 Health Check Endpoint
**File**: `app/api/health/route.ts` (create new file)

**Checkpoints**:
- [ ] Health endpoint created at `/api/health`
- [ ] Endpoint tests database connectivity:
  ```typescript
  export async function GET() {
    try {
      await prisma.user.findFirst()
      return Response.json({ ok: true, database: "connected" })
    } catch (error) {
      return Response.json({ ok: false, database: "disconnected" }, { status: 503 })
    }
  }
  ```
- [ ] Endpoint accessible in production: `https://your-site.netlify.app/api/health`

**Why This Matters**:
- Separates auth failures from DB failures instantly
- Quick way to verify database connectivity without full auth flow
- Essential for monitoring and debugging

---

### ✅ Build & Deployment Configuration

#### 5.1 Netlify Build Settings
**Location**: Netlify Dashboard → Site Settings → Build & Deploy

**Checkpoints**:
- [ ] **Build Command**: `npm run build` (or `next build`)
- [ ] **Publish Directory**: `.next` (or default Next.js output)
- [ ] **Node Version**: Compatible with Next.js 16.0.7 (Node 18+ recommended)
- [ ] **Function Timeout Awareness**: Netlify functions have a **10s timeout**
  - OAuth + DB + cold start can hit this limit
  - Keep auth logic minimal
  - Avoid extra DB queries in callbacks
  - Monitor function execution time in Netlify logs

#### 5.2 Package Dependencies
**File**: `package.json`

**Checkpoints**:
- [ ] `prisma`: `6.19.1` (exact version, no caret)
- [ ] `@prisma/client`: `6.19.1` (exact version, no caret)
- [ ] `@auth/prisma-adapter`: Latest compatible version
- [ ] `next-auth`: `^5.0.0-beta.30` or stable version

**Verification**:
```bash
npm install --production
npm run build
```

#### 5.3 Prisma Generate in Build
**Checkpoints**:
- [ ] `postinstall` script includes `prisma generate` (if needed)
- [ ] Or Netlify build command includes: `prisma generate && npm run build`

**Recommended**: Add to `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

---

## Part 2: Production Deployment Steps

### Step 1: Pre-Deployment Verification

1. **Run Local Build Test**:
   ```bash
   npm install
   npx prisma generate
   npm run build
   ```
   - [ ] Build succeeds without errors
   - [ ] No TypeScript errors
   - [ ] No Prisma errors

2. **Verify Environment Variables Locally**:
   ```bash
   # Create .env.production with production values
   DATABASE_URL=[production-supabase-url]
   NEXTAUTH_URL=https://your-site.netlify.app
   NEXTAUTH_SECRET=[production-secret]
   GOOGLE_CLIENT_ID=[production-client-id]
   GOOGLE_CLIENT_SECRET=[production-client-secret]
   ```
   - [ ] Test build with production env vars (locally)
   - [ ] Verify no hardcoded development URLs

3. **Database Migration Status**:
   ```bash
   npx prisma migrate status
   ```
   - [ ] All migrations applied
   - [ ] Database schema matches `prisma/schema.prisma`

---

### Step 2: Netlify Deployment

1. **Set Environment Variables in Netlify**:
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add all required variables (see Part 1, Section 1.1)
   - [ ] All variables added
   - [ ] No typos or extra spaces
   - [ ] Sensitive variables marked as "Encrypted"

2. **Trigger Deployment**:
   - Push to production branch (or trigger manual deploy)
   - [ ] Deployment starts
   - [ ] Build logs show no errors
   - [ ] Prisma generate runs successfully
   - [ ] Next.js build completes

3. **Verify Deployment**:
   - [ ] Site is accessible at production URL
   - [ ] No runtime errors in browser console
   - [ ] No server errors in Netlify function logs

---

### Step 3: Post-Deployment Verification

1. **Test SSO Flow**:
   - [ ] Navigate to `/login` page
   - [ ] Click "Sign in with Google"
   - [ ] Redirects to Google OAuth consent screen
   - [ ] After consent, redirects back to application
   - [ ] User is authenticated and can access protected routes

2. **Verify Database Write**:
   - [ ] Check Supabase Dashboard → Table Editor → `User` table
   - [ ] New user record appears with:
     - Email address (from Google account)
     - Name (from Google account)
     - `createdAt` timestamp
   - [ ] Check `Account` table:
     - Record linked to User via `userId`
     - `provider` = "google"
     - `providerAccountId` = Google user ID
   - [ ] **Explicit Adapter Verification** (temporary - remove after verification):
     - Add temporary logging to `signIn` callback in `auth.ts`:
       ```typescript
       callbacks: {
         async signIn({ user }) {
           console.log("User persisted:", user.id, user.email)
           return true
         }
       }
       ```
     - Check Netlify function logs after sign-in
     - Verify log shows "User persisted:" with user ID and email
     - **Remove this logging after verification** (keep production clean)

3. **Test Session Persistence**:
   - [ ] Refresh page - user remains logged in
   - [ ] Close browser and reopen - session persists (if using database sessions)
   - [ ] Check `Session` table in Supabase (if using database sessions)

4. **Test Error Scenarios**:
   - [ ] Cancel Google OAuth - user redirected to login page
   - [ ] Invalid credentials - appropriate error shown
   - [ ] Network error - graceful error handling

---

## Part 3: Verification After Going Live

### Immediate Checks (Within 5 minutes)

1. **Application Accessibility**:
   - [ ] Site loads at production URL
   - [ ] No 500 errors
   - [ ] No database connection errors in logs

2. **Authentication Endpoints**:
   - [ ] `/api/auth/signin` accessible
   - [ ] `/api/auth/callback/google` accessible
   - [ ] `/api/auth/session` returns correct session data

3. **Database Connectivity**:
   - [ ] Prisma Client can connect to Supabase
   - [ ] No connection timeout errors
   - [ ] Queries execute successfully
   - [ ] Health check endpoint returns 200: `https://your-site.netlify.app/api/health`
     - Should return: `{"ok": true, "database": "connected"}`

### Functional Tests (Within 30 minutes)

1. **End-to-End SSO Test**:
   - [ ] Complete Google SSO flow works
   - [ ] User data saved to Supabase
   - [ ] User can access protected routes
   - [ ] User can sign out

2. **Multiple User Test**:
   - [ ] Test with 2-3 different Google accounts
   - [ ] Each user creates separate record in database
   - [ ] No duplicate email errors
   - [ ] Sessions work independently

3. **Error Handling**:
   - [ ] Invalid OAuth state handled gracefully
   - [ ] Database errors don't crash application
   - [ ] User sees appropriate error messages

### Monitoring (First 24 hours)

1. **Netlify Function Logs**:
   - [ ] Monitor for authentication errors
   - [ ] Check for database connection issues
   - [ ] Verify no unexpected errors

2. **Supabase Dashboard**:
   - [ ] Monitor database connections
   - [ ] Check query performance
   - [ ] Verify no connection pool exhaustion

3. **Google Cloud Console**:
   - [ ] Check OAuth consent screen metrics
   - [ ] Monitor for authentication errors
   - [ ] Verify redirect URI usage

---

## Part 4: Rollback Procedures

### Scenario 1: Authentication Not Working

**Symptoms**:
- Users cannot sign in with Google
- OAuth redirect fails
- "redirect_uri_mismatch" errors

**Rollback Steps**:

1. **Immediate Actions**:
   ```bash
   # In Netlify Dashboard
   # 1. Go to Deploys → Previous successful deploy
   # 2. Click "Publish deploy" to rollback
   ```

2. **Verify Rollback**:
   - [ ] Previous version is live
   - [ ] Site is accessible
   - [ ] No critical errors

3. **Root Cause Investigation**:
   - Check Netlify environment variables (especially `NEXTAUTH_URL`)
   - Verify Google OAuth redirect URIs match production URL
   - Check Netlify function logs for errors

4. **Fix and Redeploy**:
   - Fix configuration issues
   - Test locally with production env vars
   - Redeploy after verification

---

### Scenario 2: Database Connection Fails

**Symptoms**:
- "Can't reach database server" errors
- Prisma Client initialization fails
- 500 errors on authentication endpoints

**Rollback Steps**:

1. **Immediate Actions**:
   - Rollback to previous deploy (same as Scenario 1)
   - [ ] Site accessible (even if auth is broken)

2. **Database Verification**:
   - Check Supabase Dashboard → Database status
   - Verify `DATABASE_URL` in Netlify matches Supabase connection string
   - Test connection from local machine:
     ```bash
     psql [DATABASE_URL]
     ```

3. **Common Fixes**:
   - Update `DATABASE_URL` in Netlify if incorrect
   - Check Supabase project hasn't been paused
   - Verify network access (if IP restrictions exist)
   - Use connection pooler URL if available

4. **Redeploy After Fix**:
   - Update environment variables
   - Trigger new deployment
   - Verify database connectivity

---

### Scenario 3: User Data Not Saving

**Symptoms**:
- SSO login succeeds
- User can access application
- But no data in Supabase `User` table

**Rollback Steps**:

1. **Immediate Actions**:
   - Check if this is a new issue or existing
   - Verify Prisma Adapter is configured correctly
   - Check Netlify function logs for Prisma errors

2. **Diagnosis**:
   - Verify `adapter: PrismaAdapter(prisma)` in `auth.ts`
   - Check Prisma Client is initializing correctly
   - Verify database schema matches Prisma schema

3. **Fix Options**:
   - If Prisma Adapter missing: Add it and redeploy
   - If schema mismatch: Run migrations and redeploy
   - If Prisma version issue: Verify Prisma 6.19.1 is deployed

4. **Verification**:
   - Test SSO flow after fix
   - Verify user appears in Supabase
   - Check `Account` table for linked record

---

### Scenario 4: Complete Site Failure

**Symptoms**:
- Site returns 500 errors
- Build succeeded but runtime fails
- Critical errors in Netlify logs

**Rollback Steps**:

1. **Emergency Rollback**:
   ```bash
   # Netlify Dashboard → Deploys
   # Find last known good deploy
   # Click "Publish deploy"
   ```
   - [ ] Previous version is live
   - [ ] Site is accessible

2. **Investigation**:
   - Review Netlify function logs
   - Check build logs for warnings
   - Verify all environment variables are set
   - Test locally with production environment variables

3. **Gradual Rollback** (if needed):
   - Disable authentication feature flag (if exists)
   - Or revert to previous code version
   - Or disable SSO and use alternative auth

4. **Communication**:
   - Notify users if authentication is temporarily unavailable
   - Provide status updates
   - Set up monitoring for future issues

---

### Scenario 5: Cookie Dropped After Redirect

**Symptoms**:
- User signs in successfully
- Redirects back to application
- But session is lost (user appears logged out)
- Cookies not present in browser DevTools

**Rollback Steps**:

1. **Immediate Actions**:
   - Rollback to previous deploy (same as Scenario 1)
   - [ ] Site accessible

2. **Diagnosis**:
   - Check browser DevTools → Application → Cookies
   - Verify cookie domain matches production URL
   - Check if `sameSite` attribute is correct
   - Verify `secure` flag is set (required for HTTPS)
   - Check Netlify function logs for cookie-setting errors

3. **Common Fixes**:
   - Ensure `NEXTAUTH_URL` matches production URL exactly (no trailing slash)
   - Verify `NEXTAUTH_URL_INTERNAL` is set correctly
   - Check if custom domain requires different cookie domain
   - Verify `trustHost: true` is set in NextAuth config

4. **Redeploy After Fix**:
   - Update environment variables if needed
   - Redeploy and test cookie persistence
   - Verify cookies persist after redirect

---

### Scenario 6: Prisma Client Init Failure Post-Deploy

**Symptoms**:
- Build succeeds on Netlify
- Site deploys successfully
- But runtime errors: `PrismaClientInitializationError`
- Database queries fail

**Rollback Steps**:

1. **Immediate Actions**:
   - Rollback to previous deploy
   - [ ] Site accessible

2. **Diagnosis**:
   - Check Netlify function logs for Prisma initialization errors
   - Verify `prisma/schema.prisma` has correct `binaryTargets`:
     ```prisma
     generator client {
       provider      = "prisma-client-js"
       binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
     }
     ```
   - Verify Prisma version is 6.19.1 (not 7.x)
   - Check if `prisma generate` ran during build

3. **Common Fixes**:
   - Add/update `binaryTargets` in schema
   - Ensure `postinstall` script includes `prisma generate`
   - Verify build command includes `prisma generate`
   - Check Netlify build logs for Prisma generation errors

4. **Redeploy After Fix**:
   - Update schema with binary targets
   - Trigger new deployment
   - Verify Prisma Client initializes correctly

---

### Scenario 7: OAuth Success But Adapter Write Failure

**Symptoms**:
- Google OAuth flow completes successfully
- User is redirected back to application
- User appears logged in
- But no data in Supabase `User` or `Account` tables

**Rollback Steps**:

1. **Immediate Actions**:
   - Check Netlify function logs for Prisma errors
   - Verify Prisma Adapter is configured: `adapter: PrismaAdapter(prisma)`
   - Check if database connection is working (use health endpoint)

2. **Diagnosis**:
   - Verify `adapter: PrismaAdapter(prisma)` is present in `auth.ts`
   - Check Netlify logs for Prisma write errors
   - Verify database schema matches Prisma schema
   - Check if RLS policies are blocking writes (if enabled)
   - Verify connection pooler URL is being used

3. **Common Fixes**:
   - If adapter missing: Add `PrismaAdapter(prisma)` to NextAuth config
   - If RLS blocking: Disable RLS on auth tables OR configure service role access
   - If connection issue: Verify `DATABASE_URL` uses pooler URL
   - If schema mismatch: Run migrations: `npx prisma migrate deploy`

4. **Verification**:
   - Test SSO flow after fix
   - Check Supabase `User` table for new record
   - Verify `Account` table has linked record
   - Check Netlify logs for successful adapter writes

---

## Part 5: Verification Checklist Summary

### Pre-Deployment ✅

- [ ] All environment variables set in Netlify
- [ ] Google OAuth configured with production URLs
- [ ] Supabase database accessible and schema correct
- [ ] Local build succeeds with production env vars
- [ ] All migrations applied to database
- [ ] Code reviewed and tested locally

### Deployment ✅

- [ ] Build succeeds on Netlify
- [ ] Prisma generate runs successfully
- [ ] No build errors or warnings
- [ ] Site is accessible at production URL

### Post-Deployment ✅

- [ ] SSO login flow works end-to-end
- [ ] User data saved to Supabase
- [ ] Sessions work correctly
- [ ] Error handling works gracefully
- [ ] Multiple users can sign in independently

### Monitoring ✅

- [ ] Netlify logs monitored for errors
- [ ] Supabase dashboard checked for data
- [ ] Google OAuth metrics reviewed
- [ ] No unexpected errors in first 24 hours

---

## Part 6: Questions for Senior Architect Review

1. **Environment Variables**: Are all required environment variables listed correctly? Any missing?

   **Architect Answer**: ✅ Mostly complete. ❗ Add:
   - `NEXTAUTH_URL_INTERNAL` (Netlify-specific requirement)
   - Enforce pooled `DATABASE_URL` (connection pooler URL, not direct DB host)

2. **Google OAuth Configuration**: Are the redirect URI and JavaScript origin requirements correct for Netlify?

   **Architect Answer**: ✅ Yes. ⚠️ Ensure:
   - No trailing slashes
   - Callback path EXACT match
   - Remove all test origins

3. **Supabase Configuration**: Are there any additional Supabase settings we should verify (connection pooling, RLS policies, etc.)?

   **Architect Answer**: Add:
   - **Mandatory pooler usage** (not just recommended)
   - Explicit RLS stance: **Disable RLS on auth tables** OR ensure service role is used (advanced)

4. **Rollback Procedures**: Are the rollback scenarios comprehensive? Any additional scenarios to consider?

   **Architect Answer**: ✅ Very good. Add:
   - Cookie misconfiguration rollback
   - Prisma binary mismatch rollback

5. **Verification Steps**: Are the verification checkpoints sufficient? Any critical checks missing?

   **Architect Answer**: Add:
   - Cookie persistence check
   - Health endpoint check
   - Adapter persistence log

6. **Production Best Practices**: Any additional recommendations for production deployment?

   **Architect Answer**:
   - Enable structured auth logging
   - Pool DB connections (mandatory)
   - Lock Prisma version (you did this well)
   - Avoid edge middleware for auth initially

7. **Monitoring**: What should we monitor in the first 24-48 hours after going live?

   **Architect Answer**: Priority order:
   1. Netlify function error rate
   2. Supabase active connections
   3. OAuth callback failures
   4. Session persistence drop-offs

8. **Error Handling**: Are there any error scenarios we haven't covered?

   **Architect Answer**: Add:
   - Cookie dropped after redirect
   - Prisma client init failure post-deploy
   - OAuth success but adapter write failure

---

## Appendix: Quick Reference Commands

### Local Testing with Production Config
```bash
# Create .env.production
cp .env.local .env.production
# Update with production values

# Test build
npm install
npx prisma generate
npm run build

# Test locally (if possible)
npm run start
```

### Database Verification
```bash
# Check migration status
npx prisma migrate status

# Verify schema
npx prisma validate
npx prisma format

# Generate client
npx prisma generate
```

### Netlify CLI (if installed)
```bash
# Set environment variables
netlify env:set DATABASE_URL "[value]"

# List environment variables
netlify env:list

# Trigger deploy
netlify deploy --prod
```

---

**Document Status**: Ready for Senior Architect Review

**Next Steps**: 
1. Senior Architect reviews and validates all checkpoints
2. Team executes pre-deployment checklist
3. Deploy to production
4. Execute post-deployment verification
5. Monitor for 24-48 hours
