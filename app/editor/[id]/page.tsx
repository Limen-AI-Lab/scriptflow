import { supabase } from '@/lib/supabase/client'
import type { Script } from '@/types'
import { notFound } from 'next/navigation'
import ScriptEditor from './ScriptEditor'

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getScript(id: string): Promise<Script | null> {
  const { data, error } = await supabase
    .from('scripts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function EditorPage({
  params,
}: {
  params: { id: string }
}) {
  const script = await getScript(params.id)

  if (!script) {
    notFound()
  }

  return <ScriptEditor script={script} />
}

