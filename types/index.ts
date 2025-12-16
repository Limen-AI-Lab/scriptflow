export interface Script {
  id: string // uuid
  created_at: string
  source_url: string | null
  raw_text: string
  title: string
  content_cn_draft: string
  content_cn_final: string | null
  content_en: string | null
  audio_url: string | null
  status: 'new' | 'editing' | 'done'
  tags: string[]
}

