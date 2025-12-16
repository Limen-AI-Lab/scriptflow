# Supabase Setup with CLI (Recommended)

The Supabase CLI allows you to execute SQL and manage your project programmatically.

## Step 1: Install Supabase CLI

**Note:** Supabase CLI cannot be installed via `npm install -g`. Use one of the supported methods below:

### Windows Options:

**Option 1: Using Scoop (Recommended for Windows)**
```powershell
# First, install Scoop if you don't have it:
# Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
# irm get.scoop.sh | iex

# Then install Supabase CLI:
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Option 2: Using Chocolatey**
```powershell
# First, install Chocolatey if you don't have it:
# Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Then install Supabase CLI:
choco install supabase
```

### Mac Options:
- **Homebrew**: `brew install supabase/tap/supabase`

## Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate.

## Step 3: Link Your Project

```bash
supabase link --project-ref yunrhoxuxrzbcbkrvgjw
```

You'll need your database password (from your connection string).

## Step 4: Get Your Service Role Key

1. Go to: https://supabase.com/dashboard/project/yunrhoxuxrzbcbkrvgjw/settings/api
2. Find **service_role** key (secret)
3. Click "Reveal" and copy it
4. Add to `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

## Step 5: Execute SQL

### Option A: Using Supabase CLI Migrations (Recommended)

The modern Supabase CLI uses migrations instead of direct SQL execution:

```bash
# Create a new migration from your SQL file
supabase migration new initial_setup

# Copy the contents of supabase-setup.sql into the newly created migration file
# (located in supabase/migrations/YYYYMMDDHHMMSS_initial_setup.sql)

# Push the migration to your linked project
supabase db push --linked
```

Or if you want to apply the SQL file directly, you can:

1. Create a migration: `supabase migration new initial_setup`
2. Copy the SQL from `supabase-setup.sql` into the migration file
3. Push it: `supabase db push --linked`

### Option B: Using the Admin Script

```bash
node setup-supabase-admin.js
```

This will:
- ✅ Create the storage bucket automatically
- ⚠️ Guide you to create the table (since DDL requires CLI or dashboard)

## Step 6: Create Storage Bucket

The admin script will create the bucket automatically, or you can do it manually:

1. Go to: https://supabase.com/dashboard/project/yunrhoxuxrzbcbkrvgjw/storage/buckets
2. Click "New bucket"
3. Name: `scripts-audio`
4. Check "Public bucket"
5. Click "Create bucket"

## Alternative: Direct PostgreSQL Connection

If you have `psql` installed, you can connect directly:

```bash
psql "postgresql://postgres:[YOUR_PASSWORD]@db.yunrhoxuxrzbcbkrvgjw.supabase.co:5432/postgres" -f supabase-setup.sql
```

Replace `[YOUR_PASSWORD]` with your actual database password.

