# How to Get Supabase Pooler URL

## Based on Your Screenshot

You're currently on the **Database Settings** page and can see the "Connection pooling configuration" section with "SHARED POOLER". However, the actual connection string URL is **not visible on this page**.

### Step 1: Find the Connection String Section
The connection string is shown in a **different section**. Here's where to find it:

1. **Look at the left sidebar** - In the "DATABASE MANAGEMENT" section, you should see:
   - Click on **"Connection String"** or **"Connection Info"** (if visible)
   - OR look for a tab/section at the top of the Database Settings page

2. **Alternative path** (if not in sidebar):
   - In the left sidebar, under **"CONFIGURATION"**, look for:
     - **"Connection String"** 
     - OR go to: **Settings** (gear icon at top) → **Database** → **Connection String**

3. **If you see tabs** at the top of Database Settings page:
   - Click on the **"Connection String"** or **"URI"** tab
   - This is where the actual URLs are displayed

### Step 2: Find the Pooler Connection String
Once you're in the Connection String section, you'll see **multiple connection strings**. Look for:

**Connection Pooler (port 6543)** - ✅ USE THIS FOR PRODUCTION
- It will be labeled as "Connection Pooler" or "Pooler" or "Session mode"
- The URL will contain **`:6543`** (NOT `:5432`)
- Format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
- Or: `postgresql://postgres:[password]@[pooler-host].supabase.co:6543/postgres`

**Direct connection (port 5432)** - ❌ DO NOT USE THIS
- Will be labeled as "Direct connection" or "Transaction mode"
- Contains `:5432` in the URL
- Format: `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`

### Step 3: Copy the Pooler URL
- Find the connection string that contains **`:6543`** (NOT `:5432`)
- Click the **"Copy"** button next to it, or select and copy the entire string
- It should look something like:
  ```
  postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
  ```

### Step 4: Replace Password
The copied URL will have `[password]` placeholder. Replace it with your actual database password:
- Your password is: `Monisha@123` (from your local `.env.local`)
- Replace `[password]` with `Monisha@123` in the URL

**Example transformation:**
```
Before: postgresql://postgres.npktknoqdivjlwpgjvtb:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
After:  postgresql://postgres.npktknoqdivjlwpgjvtb:Monisha@123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Note:** If your password contains special characters like `@`, you may need to URL-encode them:
- `@` becomes `%40`
- So `Monisha@123` becomes `Monisha%40123`

### Quick Navigation Tips

Based on your screenshot, the connection string is likely in one of these places:

1. **Check the top of Database Settings page** - Look for tabs like:
   - "Connection String"
   - "URI" 
   - "Connection Info"

2. **Check left sidebar** - Under "DATABASE MANAGEMENT" or "CONFIGURATION":
   - Look for "Connection String" option
   - It might be a separate menu item

3. **Click the "Docs" button** next to "Connection pooling configuration" - It might link to where the connection strings are shown

4. **Try this direct path:**
   - In left sidebar: **Settings** → **Database** → **Connection String** (or **Connection Info**)

### Quick Check: What to Look For

✅ **Correct pooler URL will have:**
- Port `:6543` (NOT `:5432`)
- Hostname containing `pooler` or `pooler.supabase.com`
- Format: `postgresql://postgres.[ref]:[password]@[pooler-host]:6543/postgres`

❌ **Wrong direct connection will have:**
- Port `:5432`
- Hostname like `db.[project-ref].supabase.co`
- Format: `postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres`

---

## Still Can't Find It?

If you still can't find the pooler URL:

1. **Check Supabase documentation:**
   - Visit: https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler
   - This page shows exactly where to find it

2. **Contact Supabase support** or check their help docs

3. **Manual construction** (if you know your project details):
   - Project reference: `npktknoqdivjlwpgjvtb`
   - Password: `Monisha@123` (URL-encoded: `Monisha%40123`)
   - The pooler URL format is usually: `postgresql://postgres.npktknoqdivjlwpgjvtb:Monisha%40123@aws-0-[region].pooler.supabase.com:6543/postgres`
   - You'll need to know your region (us-east-1, ap-south-1, etc.)

---

## Once You Have It

After you get the pooler URL:
1. Copy it completely
2. Add it to Netlify as `DATABASE_URL` environment variable
3. Make sure it has port `6543` (not `5432`)
4. Test it works by checking the health endpoint after deployment
