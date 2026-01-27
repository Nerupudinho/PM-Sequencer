# Supabase User Verification

## ✅ Yes, Users ARE Saved to Supabase When Running Locally

**Important**: Your `DATABASE_URL` points to Supabase (remote), so:
- ✅ Users ARE saved to Supabase even when running locally
- ✅ The database is NOT local - it's your Supabase cloud database
- ✅ You can see users in Supabase dashboard immediately after sign-in

## How to Verify Users in Supabase

### Option 1: Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Table Editor** → **User** table
4. You should see all signed-in users

### Option 2: Run Check Script
```bash
# Load env and check users
export $(cat .env.local | grep DATABASE_URL | xargs)
npx tsx check-supabase-users.ts
```

### Option 3: Prisma Studio
```bash
npx prisma studio
```
Opens a GUI to view your Supabase database.

## Why Users Might Not Appear

If users aren't showing up, check:

1. **Database save is failing** - Check server logs for errors
2. **OAuth callback not completing** - User might not be reaching the JWT callback
3. **Prisma connection issue** - Verify `DATABASE_URL` is correct

## Code Location

User save happens in `auth.ts` → `jwt` callback → lines 53-83:
- Saves user on first Google sign-in
- Uses `prisma.user.upsert()` to create or update
- Saves to Supabase (remote database)
