/**
 * Supabase Setup Script
 * Run with: node setup-supabase.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load .env.local manually
function loadEnv() {
  const envPath = path.join(__dirname, '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!')
    process.exit(1)
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const env = {}
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim()
      }
    }
  })
  
  return env
}

const env = loadEnv()
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setup() {
  console.log('🚀 Setting up Supabase...\n')
  console.log('📋 Since SQL execution requires admin privileges, please follow these steps:\n')
  
  console.log('1️⃣  CREATE THE DATABASE TABLE:')
  console.log('   ──────────────────────────────────────────────────────────')
  console.log('   • Go to: https://supabase.com/dashboard/project/yunrhoxuxrzbcbkrvgjw/sql/new')
  console.log('   • Copy the SQL from: supabase-setup.sql')
  console.log('   • Paste and click "Run"\n')
  
  console.log('2️⃣  CREATE THE STORAGE BUCKET:')
  console.log('   ──────────────────────────────────────────────────────────')
  console.log('   • Go to: https://supabase.com/dashboard/project/yunrhoxuxrzbcbkrvgjw/storage/buckets')
  console.log('   • Click "New bucket"')
  console.log('   • Name: scripts-audio')
  console.log('   • Check "Public bucket"')
  console.log('   • Click "Create bucket"\n')
  
  console.log('3️⃣  VERIFYING SETUP...\n')
  
  // Verify table
  try {
    const { data, error } = await supabase.from('scripts').select('id').limit(1)
    if (error) {
      console.log('⚠️  Table not found yet. Please run the SQL script first.')
    } else {
      console.log('✅ Table "scripts" exists and is accessible!')
    }
  } catch (err) {
    console.log('⚠️  Could not verify table:', err.message)
  }
  
  // Verify storage
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets()
    if (error) {
      console.log('⚠️  Could not check storage buckets')
    } else {
      const bucketExists = buckets?.some(b => b.name === 'scripts-audio')
      if (bucketExists) {
        console.log('✅ Storage bucket "scripts-audio" exists!')
      } else {
        console.log('⚠️  Storage bucket "scripts-audio" not found. Please create it.')
      }
    }
  } catch (err) {
    console.log('⚠️  Could not verify storage')
  }
  
  console.log('\n✨ Once you complete the steps above, your app will be ready!')
}

setup().catch(console.error)

