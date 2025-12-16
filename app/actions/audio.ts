'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Server-side Supabase client for storage operations
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY
const MINIMAX_GROUP_ID = process.env.MINIMAX_GROUP_ID

if (!MINIMAX_API_KEY || !MINIMAX_GROUP_ID) {
  throw new Error('Missing Minimax API credentials')
}

export async function generateAudio(text: string, scriptId: string): Promise<string> {
  try {
    // Call Minimax T2S API
    const minimaxResponse = await fetch('https://api.minimax.chat/v1/text_to_speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        group_id: MINIMAX_GROUP_ID,
        text: text,
        voice_id: 'female-shaonv', // Default voice, can be customized
      }),
    })

    if (!minimaxResponse.ok) {
      const errorText = await minimaxResponse.text()
      console.error('Minimax API error:', errorText)
      throw new Error(`Minimax API error: ${minimaxResponse.status}`)
    }

    // Get audio as arrayBuffer
    const arrayBuffer = await minimaxResponse.arrayBuffer()

    // Generate timestamp for unique filename
    const timestamp = Date.now()
    const fileName = `${scriptId}_${timestamp}.mp3`
    const filePath = `public/${fileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('scripts-audio')
      .upload(filePath, arrayBuffer, {
        contentType: 'audio/mpeg',
        upsert: false, // Don't overwrite existing files
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      throw new Error('Failed to upload audio to storage')
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('scripts-audio')
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl

    // Update scripts table with audio_url
    const { error: updateError } = await supabase
      .from('scripts')
      .update({ audio_url: publicUrl })
      .eq('id', scriptId)

    if (updateError) {
      console.error('Error updating script:', updateError)
      throw new Error('Failed to update script with audio URL')
    }

    return publicUrl
  } catch (error) {
    console.error('Error generating audio:', error)
    throw new Error('Failed to generate audio. Please try again.')
  }
}

