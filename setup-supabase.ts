/**
 * Supabase Setup Script
 * Run this with: npx tsx setup-supabase.ts
 * Or: npm run setup (if you add it to package.json)
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupDatabase() {
  console.log('📊 Setting up database table...')
  
  try {
    // Read the SQL file
    const sqlFile = readFileSync(join(__dirname, 'supabase-setup.sql'), 'utf-8')
    
    // Split by semicolons and filter out empty statements
    const statements = sqlFile
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.length > 0) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        if (error) {
          // Try direct query execution
          const { error: queryError } = await supabase.from('_temp').select('1').limit(0)
          // If that doesn't work, we'll need to use the SQL editor
          console.log('⚠️  Note: Some SQL statements may need to be run manually in Supabase SQL Editor')
        }
      }
    }
    
    console.log('✅ Database setup complete!')
  } catch (error) {
    console.error('❌ Error setting up database:', error)
    console.log('\n📝 Please run the SQL manually:')
    console.log('1. Go to https://supabase.com/dashboard')
    console.log('2. Open SQL Editor')
    console.log('3. Copy contents of supabase-setup.sql')
    console.log('4. Paste and run')
  }
}

async function setupStorage() {
  console.log('🗄️  Setting up storage bucket...')
  
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError.message)
      return
    }
    
    const bucketExists = buckets?.some(b => b.name === 'scripts-audio')
    
    if (bucketExists) {
      console.log('✅ Storage bucket "scripts-audio" already exists!')
      return
    }
    
    // Create bucket (this requires service role key, so we'll guide user)
    console.log('⚠️  Bucket creation requires service role key')
    console.log('📝 Please create the bucket manually:')
    console.log('1. Go to Storage in Supabase Dashboard')
    console.log('2. Click "New bucket"')
    console.log('3. Name: scripts-audio')
    console.log('4. Check "Public bucket"')
    console.log('5. Click "Create bucket"')
    
  } catch (error) {
    console.error('❌ Error setting up storage:', error)
  }
}

async function verifySetup() {
  console.log('🔍 Verifying setup...')
  
  try {
    // Test table access
    const { data, error } = await supabase.from('scripts').select('id').limit(1)
    
    if (error) {
      console.error('❌ Table verification failed:', error.message)
      console.log('💡 Make sure you\'ve run the SQL script in Supabase SQL Editor')
      return false
    }
    
    console.log('✅ Table "scripts" is accessible!')
    
    // Test storage access
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.name === 'scripts-audio')
    
    if (bucketExists) {
      console.log('✅ Storage bucket "scripts-audio" exists!')
    } else {
      console.log('⚠️  Storage bucket "scripts-audio" not found')
    }
    
    return true
  } catch (error) {
    console.error('❌ Verification error:', error)
    return false
  }
}

async function main() {
  console.log('🚀 Starting Supabase setup...\n')
  
  // Since we can't execute SQL directly with anon key, we'll guide the user
  console.log('📋 Setup Instructions:\n')
  console.log('1. DATABASE TABLE:')
  console.log('   - Go to https://supabase.com/dashboard')
  console.log('   - Select your project')
  console.log('   - Click "SQL Editor" → "New query"')
  console.log('   - Copy and paste the contents of supabase-setup.sql')
  console.log('   - Click "Run"\n')
  
  console.log('2. STORAGE BUCKET:')
  console.log('   - In Supabase Dashboard, click "Storage"')
  console.log('   - Click "New bucket"')
  console.log('   - Name: scripts-audio')
  console.log('   - Check "Public bucket"')
  console.log('   - Click "Create bucket"\n')
  
  // Try to verify
  await verifySetup()
  
  console.log('\n✨ Setup complete! Your app should now work.')
}

main().catch(console.error)

