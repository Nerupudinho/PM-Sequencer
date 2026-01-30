# Message to Supabase Expert

---

Hi! I have a connection string for my Supabase project but need a different one for production deployment.

**Project:** `npktknoqdivjlwpgjvtb`

**What I currently have:**
- Direct connection URL: `postgresql://postgres:Monisha@123@db.npktknoqdivjlwpgjvtb.supabase.co:5432/postgres` (port 5432)

**What I needed:**
- Connection Pooler URL (port 6543) for Netlify production deployment

**Update - Got it!**
- Pooler URL: `[Get from Supabase Dashboard - Connection Pooling]`
- Note: URL-encode special characters in password (e.g., `@` becomes `%40`)

Thanks for the help!

---
