# Message to Supabase Expert

---

Hi! I have a connection string for my Supabase project but need a different one for production deployment.

**Project:** `npktknoqdivjlwpgjvtb`

**What I currently have:**
- Direct connection URL: `postgresql://postgres:Monisha@123@db.npktknoqdivjlwpgjvtb.supabase.co:5432/postgres` (port 5432)

**What I needed:**
- Connection Pooler URL (port 6543) for Netlify production deployment

**Update - Got it!**
- Pooler URL: `postgresql://postgres.npktknoqdivjlwpgjvtb:Monisha%40123@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres`
- Note: Password `Monisha@123` is URL-encoded as `Monisha%40123` (the `@` becomes `%40`)

Thanks for the help!

---
