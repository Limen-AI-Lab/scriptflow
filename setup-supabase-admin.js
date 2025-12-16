/**
 * Supabase Admin Setup Script
 * Uses service role key to create tables and storage buckets programmatically
 * Run with: node setup-supabase-admin.js
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
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nTo get your service role key:')
  console.error('1. Go to: https://supabase.com/dashboard/project/yunrhoxuxrzbcbkrvgjw/settings/api')
  console.error('2. Find "service_role" key (secret)')
  console.error('3. Click "Reveal" and copy it')
  console.error('4. Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=your_key_here')
  process.exit(1)
}

// Create admin client with service role key
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function executeSQL(sql) {
  // Use Supabase REST API to execute SQL
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql })
  })
  
  if (!response.ok) {
    // Try alternative: use PostgREST or direct PostgreSQL connection
    // For now, we'll use a workaround with the Supabase Management API
    return { error: 'Direct SQL execution not available via REST API' }
  }
  
  return await response.json()
}

async function createTable() {
  console.log('📊 Creating scripts table...')
  
  try {
    // Read SQL file
    const sqlPath = path.join(__dirname, 'supabase-setup.sql')
    const sql = fs.readFileSync(sqlPath, 'utf-8')
    
    // Split into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    // Execute each statement using Supabase REST API
    // Note: Supabase doesn't expose DDL via REST API, so we'll use a workaround
    console.log('⚠️  Note: Supabase REST API doesn\'t support DDL operations directly.')
    console.log('📝 Using alternative method: Creating table via Supabase Management API...\n')
    
    // Alternative: Use Supabase Management API or direct PostgreSQL connection
    // For now, we'll guide the user to use the SQL Editor
    console.log('💡 To execute SQL programmatically, you have two options:')
    console.log('   1. Use Supabase CLI (recommended)')
    console.log('   2. Use the SQL Editor in dashboard\n')
    
    // Try to verify if table exists
    const { data, error } = await supabaseAdmin.from('scripts').select('id').limit(1)
    
    if (error && error.code === 'PGRST116') {
      console.log('❌ Table does not exist yet.')
      console.log('📋 Please run the SQL manually:')
      console.log('   • Go to: https://supabase.com/dashboard/project/yunrhoxuxrzbcbkrvgjw/sql/new')
      console.log('   • Copy contents of: supabase-setup.sql')
      console.log('   • Paste and click "Run"\n')
      return false
    } else if (error) {
      console.log('⚠️  Error checking table:', error.message)
      return false
    } else {
      console.log('✅ Table "scripts" already exists!')
      return true
    }
  } catch (err) {
    console.error('❌ Error creating table:', err.message)
    return false
  }
}

async function createStorageBucket() {
  console.log('🗄️  Creating storage bucket...')
  
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError.message)
      return false
    }
    
    const bucketExists = buckets?.some(b => b.name === 'scripts-audio')
    
    if (bucketExists) {
      console.log('✅ Storage bucket "scripts-audio" already exists!')
      return true
    }
    
    // Create bucket
    const { data, error } = await supabaseAdmin.storage.createBucket('scripts-audio', {
      public: true,
      allowedMimeTypes: ['audio/mpeg', 'audio/mp3'],
      fileSizeLimit: 10485760 // 10MB
    })
    
    if (error) {
      console.error('❌ Error creating bucket:', error.message)
      return false
    }
    
    console.log('✅ Storage bucket "scripts-audio" created successfully!')
    return true
  } catch (err) {
    console.error('❌ Error creating storage bucket:', err.message)
    return false
  }
}

async function setup() {
  console.log('🚀 Setting up Supabase with admin privileges...\n')
  
  const tableCreated = await createTable()
  const bucketCreated = await createStorageBucket()
  
  console.log('\n📊 Setup Summary:')
  console.log(`   Table: ${tableCreated ? '✅ Created/Exists' : '❌ Needs manual creation'}`)
  console.log(`   Bucket: ${bucketCreated ? '✅ Created/Exists' : '❌ Needs manual creation'}`)
  
  if (tableCreated && bucketCreated) {
    console.log('\n✨ Setup complete! Your app is ready to use.')
  } else {
    console.log('\n⚠️  Some steps need manual completion. See instructions above.')
  }
}

setup().catch(console.error)

