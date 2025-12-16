'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Script } from '@/types'
import Link from 'next/link'
import { generateText, generateTranslation } from '@/app/actions/ai'
import { generateAudio } from '@/app/actions/audio'
import { DEFAULT_MODEL } from '@/lib/gemini-models'

interface ScriptEditorProps {
  script: Script
}

const SETTINGS_STORAGE_KEY = 'scriptflow_settings'

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export default function ScriptEditor({ script: initialScript }: ScriptEditorProps) {
  const [title, setTitle] = useState(initialScript.title)
  const [content, setContent] = useState(
    initialScript.content_cn_final || initialScript.content_cn_draft
  )
  const [contentEn, setContentEn] = useState(initialScript.content_en || '')
  const [audioUrl, setAudioUrl] = useState<string | null>(initialScript.audio_url)
  const [audioLoading, setAudioLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [aiLoading, setAiLoading] = useState<string | null>(null)
  const [previousContent, setPreviousContent] = useState<string | null>(null)
  const [hookOptions, setHookOptions] = useState<string[] | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const saveEnTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load selected model from settings
  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        if (parsed.geminiModel) {
          setSelectedModel(parsed.geminiModel)
        }
      } catch (e) {
        console.error('Failed to parse saved settings:', e)
      }
    }
  }, [])

  const characterCount = content.length
  const estimatedSeconds = characterCount / 4.3
  const formattedDuration = formatDuration(estimatedSeconds)

  const saveToSupabase = useCallback(async (titleValue: string, contentValue: string, contentEnValue?: string) => {
    setSaveStatus('saving')
    
    try {
      const updateData: { title: string; content_cn_final: string; content_en?: string } = {
        title: titleValue,
        content_cn_final: contentValue,
      }
      
      if (contentEnValue !== undefined) {
        updateData.content_en = contentEnValue
      }

      const { error } = await supabase
        .from('scripts')
        .update(updateData)
        .eq('id', initialScript.id)

      if (error) {
        console.error('Error saving script:', error)
        setSaveStatus('idle')
      } else {
        setSaveStatus('saved')
        // Reset to idle after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000)
      }
    } catch (error) {
      console.error('Error saving script:', error)
      setSaveStatus('idle')
    }
  }, [initialScript.id])

  const saveEnToSupabase = useCallback(async (contentEnValue: string) => {
    try {
      const { error } = await supabase
        .from('scripts')
        .update({
          content_en: contentEnValue,
        })
        .eq('id', initialScript.id)

      if (error) {
        console.error('Error saving English content:', error)
      }
    } catch (error) {
      console.error('Error saving English content:', error)
    }
  }, [initialScript.id])

  // Debounced save effect for content and title
  useEffect(() => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      saveToSupabase(title, content)
      saveTimeoutRef.current = null
    }, 1000)

    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [content, title, saveToSupabase])

  // Debounced save effect for English content
  useEffect(() => {
    // Clear existing timeout
    if (saveEnTimeoutRef.current) {
      clearTimeout(saveEnTimeoutRef.current)
    }

    // Set new timeout
    saveEnTimeoutRef.current = setTimeout(() => {
      if (contentEn.trim()) {
        saveEnToSupabase(contentEn)
      }
      saveEnTimeoutRef.current = null
    }, 1000)

    // Cleanup
    return () => {
      if (saveEnTimeoutRef.current) {
        clearTimeout(saveEnTimeoutRef.current)
      }
    }
  }, [contentEn, saveEnToSupabase])

  const handleFixCTA = async () => {
    if (!content.trim()) return

    setAiLoading('fix-cta')
    setPreviousContent(content)

    try {
      const prompt = `Optimize the call to action at the end to be engaging for social media. Keep the rest of the content unchanged. Only modify the call to action part.\n\n${content}`
      const result = await generateText(prompt, selectedModel)
      setContent(result.trim())
    } catch (error: any) {
      console.error('Error fixing CTA:', error)
      const errorMessage = error?.message || 'Unknown error occurred'
      alert(`Failed to fix CTA: ${errorMessage}`)
    } finally {
      setAiLoading(null)
    }
  }

  const handleRewriteHook = async () => {
    if (!content.trim()) return

    setAiLoading('rewrite-hook')

    try {
      const first50Chars = content.substring(0, 50)
      const prompt = `Give me 3 viral hooks options for this text. Format your response as a numbered list (1., 2., 3.) with each hook on a new line. Only return the hooks, nothing else.\n\n${first50Chars}`
      const result = await generateText(prompt, selectedModel)
      
      // Parse the hooks from the response
      const hooks = result
        .split('\n')
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 3)
      
      setHookOptions(hooks)
    } catch (error: any) {
      console.error('Error rewriting hook:', error)
      const errorMessage = error?.message || 'Unknown error occurred'
      alert(`Failed to generate hooks: ${errorMessage}`)
    } finally {
      setAiLoading(null)
    }
  }

  const handleShorten = async () => {
    if (!content.trim()) return

    const confirmed = window.confirm(
      'This will replace your current content with a shortened version. Continue?'
    )
    if (!confirmed) return

    setAiLoading('shorten')
    setPreviousContent(content)

    try {
      const prompt = `Condense this to under 200 words but keep the key info:\n\n${content}`
      const result = await generateText(prompt, selectedModel)
      setContent(result.trim())
    } catch (error: any) {
      console.error('Error shortening:', error)
      const errorMessage = error?.message || 'Unknown error occurred'
      alert(`Failed to shorten content: ${errorMessage}`)
    } finally {
      setAiLoading(null)
    }
  }

  const handleUndo = () => {
    if (previousContent !== null) {
      setContent(previousContent)
      setPreviousContent(null)
    }
  }

  const handleSelectHook = (hook: string) => {
    // Replace the first 50 characters with the selected hook
    const restOfContent = content.substring(50)
    setContent(hook + restOfContent)
    setHookOptions(null)
  }

  const handleGenerateEnglish = async () => {
    if (!content.trim()) return

    setAiLoading('generate-english')

    try {
      const translated = await generateTranslation(content, selectedModel)
      setContentEn(translated.trim())
    } catch (error: any) {
      console.error('Error generating English translation:', error)
      const errorMessage = error?.message || 'Unknown error occurred'
      alert(`Failed to generate English translation: ${errorMessage}`)
    } finally {
      setAiLoading(null)
    }
  }

  const handleGenerateAudio = async () => {
    if (!content.trim()) return

    setAudioLoading(true)

    try {
      const url = await generateAudio(content, initialScript.id)
      setAudioUrl(url)
    } catch (error) {
      console.error('Error generating audio:', error)
      alert('Failed to generate audio. Please try again.')
    } finally {
      setAudioLoading(false)
    }
  }

  const handleDownloadAudio = () => {
    if (!audioUrl) return

    const link = document.createElement('a')
    link.href = audioUrl
    link.download = `script_${initialScript.id}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
              ScriptFlow
            </Link>
            <div className="flex items-center gap-4">
              {saveStatus === 'saving' && (
                <span className="text-sm text-gray-500">Saving...</span>
              )}
              {saveStatus === 'saved' && (
                <span className="text-sm text-green-600">Saved</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 2 Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
          {/* Left Column - Source (Read-only) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Source</h2>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col p-6">
              {/* Source URL */}
              {initialScript.source_url && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source URL
                  </label>
                  <a
                    href={initialScript.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {initialScript.source_url}
                  </a>
                </div>
              )}

              {/* Raw Text */}
              <div className="flex-1 flex flex-col min-h-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raw Text
                </label>
                <div className="flex-1 overflow-auto bg-gray-50 border border-gray-200 rounded p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                    {initialScript.raw_text}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Workspace */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Workspace</h2>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col p-6">
              {/* Title Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter script title..."
                />
              </div>

              {/* AI Toolbar */}
              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  onClick={handleFixCTA}
                  disabled={aiLoading !== null || !content.trim()}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {aiLoading === 'fix-cta' ? 'Processing...' : 'Fix CTA'}
                </button>
                <button
                  onClick={handleRewriteHook}
                  disabled={aiLoading !== null || !content.trim()}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {aiLoading === 'rewrite-hook' ? 'Processing...' : 'Rewrite Hook'}
                </button>
                <button
                  onClick={handleShorten}
                  disabled={aiLoading !== null || !content.trim()}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {aiLoading === 'shorten' ? 'Processing...' : 'Shorten'}
                </button>
                {previousContent !== null && (
                  <button
                    onClick={handleUndo}
                    className="px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Undo
                  </button>
                )}
              </div>

              {/* Main Editor */}
              <div className="flex-[2] flex flex-col min-h-0 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Content (CN Final)
                  </label>
                  {!audioUrl && (
                    <button
                      onClick={handleGenerateAudio}
                      disabled={audioLoading || !content.trim()}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {audioLoading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        'Generate Audio'
                      )}
                    </button>
                  )}
                  {audioUrl && (
                    <div className="flex items-center gap-2">
                      <audio controls className="h-8">
                        <source src={audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                      <button
                        onClick={handleDownloadAudio}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Download
                      </button>
                    </div>
                  )}
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-sans"
                  placeholder="Enter content..."
                />
              </div>

              {/* Stats Bar */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between mb-4">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-sm text-gray-600">Characters: </span>
                    <span className="text-sm font-medium text-gray-900">
                      {characterCount.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Duration: </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formattedDuration}
                    </span>
                  </div>
                </div>
              </div>

              {/* English Version Section */}
              <div className="flex-[1] flex flex-col min-h-0 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    English Version
                  </label>
                  <button
                    onClick={handleGenerateEnglish}
                    disabled={aiLoading !== null || !content.trim()}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiLoading === 'generate-english' ? 'Generating...' : 'Generate English Version'}
                  </button>
                </div>
                <textarea
                  value={contentEn}
                  onChange={(e) => setContentEn(e.target.value)}
                  className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-sans min-h-[120px]"
                  placeholder="English translation will appear here..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hook Options Modal */}
      {hookOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Select a Hook</h3>
            </div>
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <div className="space-y-3">
                {hookOptions.map((hook, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectHook(hook)}
                    className="w-full text-left p-4 border border-gray-200 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-gray-500 mt-1">
                        {index + 1}.
                      </span>
                      <p className="text-sm text-gray-900 flex-1">{hook}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setHookOptions(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

