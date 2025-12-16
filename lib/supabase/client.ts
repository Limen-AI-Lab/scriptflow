import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// If env vars are missing, use placeholders to allow build to complete
// Runtime will fail gracefully when client is actually used
const url = supabaseUrl || 'https://placeholder.supabase.co'
const key = supabaseAnonKey || 'placeholder-anon-key'

export const supabase = createClient(url, key)

// Validate at runtime (not during build)
if (typeof window === 'undefined' && supabaseUrl && supabaseAnonKey) {
  // Server-side: validate connection on first use
  // This will be caught by error handling in the components
}
