'use client'

import { useState } from 'react'
import { generateText } from '@/app/actions/ai'
import { GEMINI_MODELS, DEFAULT_MODEL } from '@/lib/gemini-models'

export default function TestAIPage() {
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [prompt, setPrompt] = useState('Hello, how are you?')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTest = async () => {
    setLoading(true)
    setError(null)
    setResult('')

    try {
      const response = await generateText(prompt, selectedModel)
      setResult(response)
    } catch (err: any) {
      setError(err?.message || String(err))
      console.error('Test error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">AI Model Test</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Model
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {GEMINI_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.status})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
          />
          <button
            onClick={handleTest}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Model'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
            <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-green-800 font-semibold mb-2">Result:</h3>
            <pre className="text-sm text-green-700 whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

