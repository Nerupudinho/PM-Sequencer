# Product Manager Request - SSO Authentication with Supabase Storage

## Objective (Product Requirement)

**Goal**: Enable Google SSO login and automatically store authenticated user email addresses in Supabase database.

**User Story**: As a user, I want to sign in with my Google account, so that my email is automatically saved to the database for future authentication and user management.

**Success Criteria**:
- User clicks "Sign in with Google"
- User authenticates via Google OAuth
- User email is automatically persisted to Supabase database
- User can access the application

---

## Current State & Problem

### What We've Implemented

1. **NextAuth v5** configured with Google Provider
2. **Prisma Adapter** integrated (as recommended)
3. **Prisma 6.19.1** installed (downgraded from 7.x per your guidance)
4. **Supabase PostgreSQL** database connection configured
5. **Database schema** created (User, Account, Session, VerificationToken models)

### Current Error

**Prisma Studio** is attempting to connect to `localhost:5432` instead of the Supabase database URL.

```
Error: Can't reach database server at `localhost:5432`
Please make sure your database server is running at `localhost:5432`.
```

**Observation**: The application build succeeds, but Prisma Studio cannot connect to the database, and we cannot verify if user data is being saved after SSO login.

---

## Technical Context (What We Understand)

### Architecture Components

1. **NextAuth v5** - Authentication library handling OAuth flow
2. **Prisma** - ORM (Object-Relational Mapping) to interact with database
3. **Prisma Adapter** - Bridge between NextAuth and Prisma for automatic user persistence
4. **Supabase** - PostgreSQL database hosting (cloud-based)
5. **PostgreSQL** - Database type (Supabase uses PostgreSQL)

### Why These Components Exist

- **NextAuth**: Handles OAuth flow, session management, security
- **Prisma**: Provides type-safe database queries (instead of raw SQL)
- **Prisma Adapter**: Automatically creates/updates User and Account records when user signs in
- **Supabase**: Cloud-hosted PostgreSQL database (we don't run our own database server)
- **PostgreSQL**: The database type Supabase uses

### Why ngrok Was Mentioned

- OAuth + PKCE (security protocol) requires HTTPS
- Local development uses HTTP (`localhost`)
- ngrok creates HTTPS tunnel for local development
- **Note**: This is only needed for local testing. Production (Netlify/Vercel) already has HTTPS.

---

## Questions for Senior Architect

### 1. Database Connection Configuration

**Issue**: Prisma Studio is connecting to `localhost:5432` instead of Supabase.

**Question**: How do we ensure Prisma Studio reads the correct `DATABASE_URL` from `.env.local`?

**Current Setup**:
- `DATABASE_URL` is set in `.env.local` pointing to Supabase
- `prisma/schema.prisma` has `url = env("DATABASE_URL")`
- Prisma Client initialization in `lib/prisma.ts` should read from environment

**What we need**: Exact steps to verify Prisma Studio connects to Supabase, not localhost.

---

### 2. Verification of User Persistence

**Question**: After successful Google SSO login, where should we check to confirm the user email was saved?

**Options we're aware of**:
- Prisma Studio (currently failing to connect)
- Supabase Dashboard (SQL Editor / Table Editor)
- Application logs

**What we need**: Recommended method to verify user data persistence after SSO login.

---

### 3. End-to-End Flow Confirmation

**Question**: Is our current setup correct for the product requirement?

**Current Flow**:
1. User clicks "Sign in with Google" → NextAuth initiates OAuth
2. User authenticates with Google → Google redirects back
3. NextAuth receives OAuth callback → Prisma Adapter should create/update User
4. User session established → User can access app

**What we need**: Confirmation that this flow is correct, or what needs to be adjusted.

---

### 4. Environment Variable Loading

**Question**: Are environment variables from `.env.local` being loaded correctly in all contexts?

**Concerns**:
- Prisma Studio might not be reading `.env.local`
- Next.js dev server might load it differently than Prisma CLI
- Build vs development environment differences

**What we need**: Best practice for ensuring `DATABASE_URL` is available to:
- Prisma Client (runtime)
- Prisma Studio (development tool)
- Prisma CLI (migrations, generate)

---

## Technical Details (For Reference)

### Current Configuration

**File**: `.env.local`
```
DATABASE_URL=postgresql://postgres:Monisha@123@db.npktknoqdivjlwpgjvtb.supabase.co:5432/postgres
NEXTAUTH_URL=https://[cloudflare-tunnel-url]
NEXTAUTH_SECRET=[secret]
GOOGLE_CLIENT_ID=[id]
GOOGLE_CLIENT_SECRET=[secret]
```

**File**: `prisma/schema.prisma`
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

**File**: `lib/prisma.ts`
```typescript
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
```

**File**: `auth.ts`
```typescript
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // ... Google Provider config
})
```

### Package Versions

- `prisma`: `6.19.1`
- `@prisma/client`: `6.19.1`
- `@auth/prisma-adapter`: `^2.11.1`
- `next-auth`: `^5.0.0-beta.30`
- `next`: `16.0.7`

---

## What We Need

1. **Immediate Fix**: How to make Prisma Studio connect to Supabase instead of localhost
2. **Verification Method**: How to confirm user emails are being saved after SSO login
3. **Confirmation**: Is the overall architecture correct for the product requirement?
4. **Best Practices**: Any recommendations for production deployment (Netlify/Vercel)

---

## Product Manager Perspective

**Core Requirement**: Google SSO login with email storage in Supabase.

**Current Blocker**: Cannot verify if emails are being saved because Prisma Studio cannot connect to database.

**Success Definition**: 
- User signs in with Google
- Email appears in Supabase database
- Can be verified via any tool/method

**Timeline**: Need to unblock this to proceed with user testing and production deployment.

---

**Request**: Please provide guidance on fixing Prisma Studio connection and confirming the end-to-end flow works correctly.
