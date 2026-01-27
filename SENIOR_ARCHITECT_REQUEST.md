# Technical Issue Summary - Request for Senior Architect Guidance

## Context

**Project**: Next.js 16 app with Google OAuth SSO using NextAuth v5 (Auth.js)
**Database**: Supabase PostgreSQL (remote cloud database)
**ORM**: Prisma 7.3.0
**Issue**: Users authenticate successfully but are NOT being saved to Supabase database

---

## Problem Statement

After successful Google OAuth sign-in:
- ✅ Authentication works (user can sign in)
- ✅ Session is created (user can access protected routes)
- ❌ **User data is NOT saved to Supabase database** (Prisma Studio shows empty User table)

**Expected Behavior**: On first Google sign-in, user should be created/updated in Supabase `User` table via Prisma.

---

## Technical Stack Details

- **Next.js**: 16.0.7
- **NextAuth**: v5 (beta.30) - Auth.js
- **Prisma**: 7.3.0
- **Database**: Supabase PostgreSQL (remote, not local)
- **Runtime**: Node.js (forced via `export const runtime = 'nodejs'` in API routes)

---

## Code Flow (What Should Happen)

1. User clicks "Sign in with Google"
2. OAuth flow completes successfully
3. NextAuth `jwt` callback is triggered with `user` and `account` objects
4. Code attempts to save user to database using Prisma:
   ```typescript
   const { prisma } = await import("@/lib/prisma")
   await prisma.user.upsert({
     where: { email: user.email! },
     create: { id: user.id, email: user.email!, name: user.name, image: user.image },
     update: { name: user.name, image: user.image }
   })
   ```
5. **Expected**: User record appears in Supabase
6. **Actual**: Error occurs, user is not saved

---

## Error Details (From Runtime Logs)

### Error Message
```
PrismaClientInitializationError: `PrismaClient` needs to be constructed with a non-empty, valid `PrismaClientOptions`:

```
new PrismaClient({
  ...
})
```

or

```
constructor() {
  super({ ... });
}
```
```

### Error Location
- **File**: `lib/prisma.ts` (line 27)
- **Context**: PrismaClient is being dynamically imported in NextAuth `jwt` callback
- **Stack trace**: Shows error occurs during dynamic import in Next.js/Turbopack build

### Runtime Evidence (From Debug Logs)

**Log Entry 249** (Before error):
```json
{
  "location": "lib/prisma.ts:14",
  "message": "PrismaClient initialization",
  "data": {
    "hasDatabaseUrl": true,
    "dbUrlPreview": "postgresql://postgres:Monisha@123@db.npktknoqdivjl...",
    "hasGlobalPrisma": false
  }
}
```

**Log Entry 250** (Error):
```json
{
  "location": "auth.ts:76",
  "message": "Database save failed",
  "data": {
    "message": "`PrismaClient` needs to be constructed with a non-empty, valid `PrismaClientOptions`",
    "userEmail": "atmuri.saiganesh@gmail.com",
    "userId": "93c2ed79-7bf2-42f8-b4ac-e7b2ee95c4c6"
  }
}
```

**Key Observations**:
- ✅ `DATABASE_URL` is available (`hasDatabaseUrl: true`)
- ✅ `DATABASE_URL` contains valid Supabase connection string
- ✅ User object is present with valid data
- ❌ PrismaClient fails to initialize during dynamic import

---

## Current Code Implementation

### `lib/prisma.ts` (Current State)
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### `auth.ts` (JWT Callback - Database Save Attempt)
```typescript
async jwt({ token, user, account }: any) {
  if (account && account.provider === "google" && user) {
    try {
      // Ensure DATABASE_URL is available before importing Prisma
      if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not available in dynamic import context')
      }
      
      // Dynamic import to avoid Edge runtime issues
      const { prisma } = await import("@/lib/prisma")
      
      await prisma.user.upsert({
        where: { email: user.email! },
        update: { name: user.name, image: user.image },
        create: {
          id: user.id,
          email: user.email!,
          name: user.name,
          image: user.image,
        },
      })
    } catch (error) {
      console.error("Failed to save user to database:", error)
      // Error is caught silently - user authentication still succeeds
    }
  }
  return token
}
```

### `prisma/schema.prisma`
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
}
```

---

## What We've Tried

### Attempt 1: Explicit DATABASE_URL Check
- ✅ Verified `DATABASE_URL` is in `.env.local`
- ✅ Verified `DATABASE_URL` is available at runtime (logs confirm)
- ❌ Still fails

### Attempt 2: PrismaClient Constructor Options
- Tried: `new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } })`
- Result: Error: "Unknown property datasources provided to PrismaClient constructor"
- **Note**: Prisma 7.x documentation says it reads from `process.env.DATABASE_URL` automatically

### Attempt 3: Empty Options Object
- Tried: `new PrismaClient({})`
- Result: Still fails with same error

### Attempt 4: Environment Variable Loading
- Added explicit checks before Prisma import
- Verified `process.env.DATABASE_URL` is available
- ❌ Still fails during PrismaClient construction

### Attempt 5: Runtime Configuration
- Added `export const runtime = 'nodejs'` to API routes
- Ensured we're not in Edge runtime
- ❌ Still fails

---

## Key Questions for Senior Architect

### 1. PrismaClient Initialization in Dynamic Import Context

**Question**: Why does PrismaClient fail to initialize when dynamically imported in NextAuth callbacks, even though:
- `DATABASE_URL` is available in `process.env`
- The same code works when Prisma is statically imported
- Prisma 7.x should read from `process.env.DATABASE_URL` automatically

**Hypothesis**: 
- Next.js/Turbopack might be stripping environment variables during dynamic imports
- PrismaClient might need explicit configuration in dynamic import contexts
- There might be a timing issue with environment variable availability

### 2. Prisma 7.x Constructor Requirements

**Question**: The error says PrismaClient needs "non-empty, valid PrismaClientOptions", but:
- Prisma 7.x docs say it reads from `process.env.DATABASE_URL` automatically
- Passing `datasources` gives "Unknown property" error
- Passing `{}` still fails

**What's the correct way to initialize PrismaClient in Prisma 7.x when dynamically imported?**

### 3. Alternative Approaches

**Question**: Should we:
- Use a different pattern for database saves in NextAuth callbacks?
- Move database save to a different location (e.g., API route, server action)?
- Use a different approach entirely (e.g., NextAuth adapter instead of manual save)?

### 4. Environment Variable Access in Next.js 16

**Question**: Are there known issues with `process.env` access in:
- Dynamic imports in Next.js 16 with Turbopack?
- NextAuth v5 callback contexts?
- Server-side code that's dynamically imported?

### 5. Production vs Development

**Question**: Will this work in production (Netlify/Vercel) even if it fails in development?
- Are environment variables handled differently in production builds?
- Should we expect different behavior?

---

## Additional Context

### Environment Setup
- **Development**: Using Cloudflare Tunnel for HTTPS (required for OAuth + PKCE)
- **Database**: Supabase PostgreSQL (remote, accessible from both local and production)
- **Environment Variables**: Stored in `.env.local` (Next.js convention)

### Prisma Configuration
- **Config File**: `prisma.config.ts` explicitly loads `.env.local` and `.env`
- **Migrations**: Successfully run (`npx prisma migrate dev`)
- **Prisma Studio**: Can connect and view database (confirms connection works)

### NextAuth Configuration
- **Session Strategy**: JWT (not database sessions)
- **Runtime**: Forced to Node.js (not Edge)
- **Callbacks**: JWT callback attempts database save on first sign-in

---

## What We Need

1. **Root Cause Analysis**: Why PrismaClient fails during dynamic import despite valid `DATABASE_URL`
2. **Solution**: Correct way to initialize PrismaClient in this context
3. **Best Practice**: Recommended pattern for saving user data in NextAuth v5 callbacks
4. **Production Readiness**: Will this work in production, or do we need a different approach?

---

## Files to Review

- `lib/prisma.ts` - PrismaClient initialization
- `auth.ts` - NextAuth configuration and JWT callback
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API routes
- `prisma/schema.prisma` - Database schema
- `.env.local` - Environment variables (contains `DATABASE_URL`)

---

## Summary

**Core Issue**: PrismaClient initialization fails during dynamic import in NextAuth callback, preventing user data from being saved to Supabase, despite `DATABASE_URL` being available and valid.

**Impact**: Users can authenticate but their data is not persisted, breaking core functionality.

**Urgency**: High - this blocks user onboarding and data collection.

**Request**: Need guidance on correct PrismaClient initialization pattern for Prisma 7.x in Next.js 16 dynamic import contexts, or alternative approach for persisting user data in NextAuth v5 callbacks.
