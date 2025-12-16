import { supabase } from '@/lib/supabase/client'
import type { Script } from '@/types'
import Link from 'next/link'

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getScripts(): Promise<Script[]> {
  try {
    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching scripts:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return []
    }

    console.log('Fetched scripts count:', data?.length || 0)
    if (data && data.length > 0) {
      console.log('First script sample:', {
        id: data[0].id,
        title: data[0].title,
        status: data[0].status
      })
    }

    return data || []
  } catch (err) {
    console.error('Exception in getScripts:', err)
    return []
  }
}

function getPlatformBadge(sourceUrl: string | null) {
  if (!sourceUrl) return null
  
  if (sourceUrl.includes('xiaohongshu')) {
    return { label: '小红书', color: 'bg-red-500' }
  }
  if (sourceUrl.includes('douyin')) {
    return { label: '抖音', color: 'bg-black text-white' }
  }
  return null
}

function getStatusBadge(status: Script['status']) {
  const styles = {
    new: 'bg-blue-500 text-white',
    editing: 'bg-yellow-500 text-white',
    done: 'bg-green-500 text-white',
  }
  
  const labels = {
    new: 'New',
    editing: 'Editing',
    done: 'Done',
  }

  return {
    label: labels[status],
    className: styles[status],
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default async function Dashboard() {
  const scripts = await getScripts()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">ScriptFlow</h1>
            <Link
              href="/settings"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ⚙️ Settings
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {scripts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No scripts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scripts.map((script) => {
              const statusBadge = getStatusBadge(script.status)
              const platformBadge = getPlatformBadge(script.source_url)

              return (
                <Link
                  key={script.id}
                  href={`/editor/${script.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6 h-full flex flex-col">
                    {/* Title */}
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 line-clamp-2">
                      {script.title}
                    </h2>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {/* Status Badge */}
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${statusBadge.className}`}
                      >
                        {statusBadge.label}
                      </span>

                      {/* Platform Badge */}
                      {platformBadge && (
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${platformBadge.color}`}
                        >
                          {platformBadge.label}
                        </span>
                      )}
                    </div>

                    {/* Creation Date */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        Created {formatDate(script.created_at)}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

