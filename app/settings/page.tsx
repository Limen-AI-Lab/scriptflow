'use client'

import { useState, useEffect } from 'react'
import { GEMINI_MODELS, DEFAULT_MODEL, type GeminiModel } from '@/lib/gemini-models'
import Link from 'next/link'

const SETTINGS_STORAGE_KEY = 'scriptflow_settings'

interface AppSettings {
  geminiModel: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    geminiModel: DEFAULT_MODEL
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(parsed)
      } catch (e) {
        console.error('Failed to parse saved settings:', e)
      }
    }
    setLoading(false)
  }, [])

  const handleSave = () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleModelChange = (modelId: string) => {
    setSettings(prev => ({ ...prev, geminiModel: modelId }))
  }

  const getModelInfo = (modelId: string): GeminiModel | undefined => {
    return GEMINI_MODELS.find(m => m.id === modelId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
              ScriptFlow
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

          {/* Gemini Model Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Google Gemini Model
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Choose which Gemini model to use for AI features (Fix CTA, Rewrite Hook, Shorten, Translation)
            </p>

            <div className="space-y-3">
              {GEMINI_MODELS.map((model) => {
                const isSelected = settings.geminiModel === model.id
                const isRecommended = model.id === DEFAULT_MODEL
                
                return (
                  <label
                    key={model.id}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="geminiModel"
                      value={model.id}
                      checked={isSelected}
                      onChange={(e) => handleModelChange(e.target.value)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {model.name}
                        </span>
                        {isRecommended && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                            Recommended
                          </span>
                        )}
                        {model.status === 'preview' && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            Preview
                          </span>
                        )}
                        {model.status === 'experimental' && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                            Experimental
                          </span>
                        )}
                        {model.status === 'deprecated' && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">
                            Deprecated
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {model.description}
                      </p>
                      {model.maxTokens && (
                        <div className="mt-2 flex gap-4 text-xs text-gray-500">
                          <span>Max Tokens: {model.maxTokens.toLocaleString()}</span>
                          {model.contextWindow && (
                            <span>Context: {model.contextWindow.toLocaleString()}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div>
              {saved && (
                <span className="text-sm text-green-600 font-medium">
                  ✓ Settings saved!
                </span>
              )}
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>

        {/* Model Information */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-blue-900 mb-2">
            Current Selection
          </h2>
          {getModelInfo(settings.geminiModel) && (
            <div className="text-sm text-blue-800">
              <p>
                <strong>Model:</strong> {getModelInfo(settings.geminiModel)?.name}
              </p>
              <p className="mt-1">
                <strong>Status:</strong>{' '}
                <span className="capitalize">
                  {getModelInfo(settings.geminiModel)?.status}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Documentation Link */}
        <div className="mt-6 text-center">
          <a
            href="https://ai.google.dev/models/gemini"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            View Google Gemini API Documentation →
          </a>
        </div>
      </main>
    </div>
  )
}

