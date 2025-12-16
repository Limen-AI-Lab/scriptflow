# Supabase Setup Guide

Follow these steps to set up your Supabase database and storage.

## Step 1: Create the Database Table

1. **Go to your Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Select your project (`yunrhoxuxrzbcbkrvgjw`)

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the SQL Script**
   - Copy the contents of `supabase-setup.sql` file
   - Paste it into the SQL Editor
   - Click "Run" (or press Ctrl+Enter)

   The script will:
   - Create the `scripts` table with all required columns
   - Set up indexes for better performance
   - Enable Row Level Security (RLS)
   - Create a policy for data access

## Step 2: Create the Storage Bucket

1. **Go to Storage**
   - Click on "Storage" in the left sidebar

2. **Create New Bucket**
   - Click "New bucket"
   - Name: `scripts-audio`
   - **Important**: Check "Public bucket" (or configure RLS policies if you prefer)
   - Click "Create bucket"

3. **Configure Bucket Policies (if not public)**
   - If you didn't make it public, go to "Policies"
   - Create policies to allow uploads and downloads

## Step 3: Verify Setup

### Test the Table
Run this query in SQL Editor to verify:
```sql
SELECT * FROM scripts LIMIT 1;
```

### Test Storage
- Go to Storage → `scripts-audio`
- Try uploading a test file
- Verify you can access the public URL

## Step 4: Insert Test Data (Optional)

If you want to test with sample data:

```sql
INSERT INTO scripts (title, raw_text, content_cn_draft, status)
VALUES (
  'Test Script',
  'This is a test script raw text content.',
  'This is the Chinese draft content.',
  'new'
);
```

## Troubleshooting

### If you get permission errors:
- Check that RLS policies are set correctly
- Verify your `.env.local` has the correct anon key
- Make sure the storage bucket is public or has proper policies

### If the table already exists:
- The SQL uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run again
- If you need to reset, you can drop and recreate:
  ```sql
  DROP TABLE IF EXISTS scripts CASCADE;
  ```
  Then run the setup script again.

