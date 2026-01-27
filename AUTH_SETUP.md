# Google SSO Authentication Setup Guide

## Prerequisites

1. **Database Setup** (Choose one):
   - **Supabase** (Recommended): Free PostgreSQL database
   - **Prisma with PostgreSQL**: Any PostgreSQL database

2. **Google Cloud Console**: OAuth 2.0 credentials

## Step 1: Database Setup

### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Project Settings > Database > Connection String
4. Copy the connection string (format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)
   - Example: `postgresql://postgres:your-password@db.npktknoqdivjlwpgjvtb.supabase.co:5432/postgres`
5. Run the Prisma migration:
   ```bash
   npx prisma migrate dev --name init
   ```

### Option B: Prisma with PostgreSQL

1. Set up a PostgreSQL database (local or cloud)
2. Update `DATABASE_URL` in `.env`
3. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

## Step 2: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **APIs & Services > Credentials**
5. Click **Create Credentials > OAuth client ID**
6. Configure OAuth consent screen (if not done)
7. Add **Authorized JavaScript origins**:
   - `https://your-ngrok-url.ngrok.io` (for local dev with ngrok - update when ngrok restarts)
   - `https://pm-monk.netlify.app` (for production)
8. Add **Authorized redirect URIs**:
   - `https://your-ngrok-url.ngrok.io/api/auth/callback/google` (for local dev with ngrok)
   - `https://pm-monk.netlify.app/api/auth/callback/google` (for production)
   
   **⚠️ IMPORTANT**: 
   - **HTTPS is required** for OAuth + PKCE to work
   - HTTP localhost will NOT work (browsers block cross-site PKCE cookies)
   - Use ngrok or similar HTTPS tunnel for development
9. Copy **Client ID** and **Client Secret**

## Step 3: Environment Variables

Create a `.env.local` file in the project root:

```env
# NextAuth Configuration
# ⚠️ IMPORTANT: Use HTTPS URL (ngrok or similar) for development
# OAuth + PKCE requires HTTPS - HTTP localhost will NOT work
NEXTAUTH_URL=https://your-ngrok-url.ngrok.io
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database Connection
DATABASE_URL=postgresql://user:password@host:5432/database

# Optional: Microsoft Clarity Analytics
NEXT_PUBLIC_CLARITY_PROJECT_ID=your-clarity-project-id
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Step 4: Run Database Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Step 5: Development Setup (HTTPS Required)

**⚠️ IMPORTANT**: OAuth + PKCE requires HTTPS. HTTP localhost will NOT work.

### Option A: ngrok (Recommended - Easiest)

1. **Install ngrok**:
   ```bash
   brew install ngrok
   # OR download from https://ngrok.com
   ```

2. **Start ngrok tunnel** (in a separate terminal):
   ```bash
   ngrok http 3000
   ```

3. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

4. **Update `.env.local`**:
   ```env
   NEXTAUTH_URL=https://abc123.ngrok.io
   ```

5. **Update Google Cloud Console**:
   - Add to **Authorized JavaScript origins**: `https://abc123.ngrok.io`
   - Add to **Authorized redirect URIs**: `https://abc123.ngrok.io/api/auth/callback/google`

6. **Start dev server**:
   ```bash
   npm run dev
   ```

7. **Visit your ngrok HTTPS URL** - you should be redirected to `/login` if not authenticated.

**Note**: ngrok URL changes each time you restart (unless you have a paid plan). Update `.env.local` and Google Console accordingly.

### Option B: Cloudflare Tunnel

```bash
cloudflared tunnel --url http://localhost:3000
```

### Option C: mkcert (Local HTTPS)

```bash
brew install mkcert
mkcert -install
mkcert localhost
# Configure Next.js to use HTTPS certificates
```

## Step 6: Deploy to Netlify

1. Add environment variables in Netlify dashboard:
   - `NEXTAUTH_URL` = `https://pm-monk.netlify.app`
   - `NEXTAUTH_SECRET` = (your generated secret)
   - `GOOGLE_CLIENT_ID` = (from Google Cloud Console)
   - `GOOGLE_CLIENT_SECRET` = (from Google Cloud Console)
   - `DATABASE_URL` = (your database connection string)

2. Update Google OAuth redirect URI to include production URL

3. Deploy:
   ```bash
   git add .
   git commit -m "Add Google SSO authentication"
   git push
   ```

## Accessing User Emails

User emails are automatically stored in the database `users` table when they sign in. To query:

```typescript
import { prisma } from "@/lib/prisma"

// Get all users
const users = await prisma.user.findMany({
  select: {
    email: true,
    name: true,
    createdAt: true,
  },
})
```

## Troubleshooting

- **"Invalid credentials"**: Check Google OAuth redirect URIs match exactly (must be HTTPS)
- **"pkceCodeVerifier value could not be parsed"**: 
  - ✅ **This is expected on HTTP localhost** - Use HTTPS (ngrok) for development
  - ✅ **Will work in production** (HTTPS is standard)
  - ❌ NextAuth v5 does NOT allow PKCE cookie overrides (by design)
- **Database connection errors**: Verify `DATABASE_URL` is correct
- **"NEXTAUTH_SECRET is missing"**: Generate and add to `.env.local`
- **Migration errors**: Run `npx prisma migrate reset` (WARNING: deletes data)
- **ngrok URL changed**: Update `.env.local` and Google Console redirect URIs