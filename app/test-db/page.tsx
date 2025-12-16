'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Script } from '@/types'

export default function TestDBPage() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    async function fetchScripts() {
      try {
        setLoading(true)
        setError(null)
        
        console.log('Starting fetch...')
        console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log('Anon Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        
        const { data, error: fetchError } = await supabase
          .from('scripts')
          .select('*')
          .order('created_at', { ascending: false })

        console.log('Fetch result:', { data, error: fetchError })

        if (fetchError) {
          console.error('Supabase error:', fetchError)
          setError(JSON.stringify(fetchError, null, 2))
          setDebugInfo({
            error: fetchError,
            errorCode: fetchError.code,
            errorMessage: fetchError.message,
            errorDetails: fetchError.details,
            errorHint: fetchError.hint
          })
        } else {
          console.log('Fetched scripts:', data)
          setScripts(data || [])
          setDebugInfo({
            count: data?.length || 0,
            firstScript: data?.[0] || null
          })
        }
      } catch (err) {
        console.error('Exception:', err)
        setError(String(err))
        setDebugInfo({ exception: err })
      } finally {
        setLoading(false)
      }
    }

    fetchScripts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Database Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>SUPABASE_URL:</strong>{' '}
              <span className="font-mono">
                {process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'}
              </span>
            </div>
            <div>
              <strong>ANON_KEY:</strong>{' '}
              <span className="font-mono">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
                  ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` 
                  : 'NOT SET'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Status</h2>
          {loading && <p className="text-blue-600">Loading...</p>}
          {error && (
            <div className="text-red-600">
              <p className="font-semibold">Error:</p>
              <pre className="bg-red-50 p-4 rounded mt-2 overflow-auto text-xs">
                {error}
              </pre>
            </div>
          )}
          {!loading && !error && (
            <p className="text-green-600">
              Success! Found {scripts.length} script(s)
            </p>
          )}
        </div>

        {debugInfo && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Debug Info</h2>
            <pre className="bg-gray-50 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Scripts ({scripts.length})</h2>
          {scripts.length === 0 ? (
            <p className="text-gray-500">No scripts found</p>
          ) : (
            <div className="space-y-4">
              {scripts.map((script) => (
                <div key={script.id} className="border border-gray-200 rounded p-4">
                  <div className="font-semibold">{script.title}</div>
                  <div className="text-sm text-gray-600 mt-2">
                    <div>ID: {script.id}</div>
                    <div>Status: {script.status}</div>
                    <div>Created: {new Date(script.created_at).toLocaleString()}</div>
                    <div className="mt-2">
                      <strong>Raw Text:</strong> {script.raw_text.substring(0, 100)}...
                    </div>
                    <div className="mt-2">
                      <strong>Draft:</strong> {script.content_cn_draft.substring(0, 100)}...
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

