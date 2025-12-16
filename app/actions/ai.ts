'use server'

import { GoogleGenAI } from '@google/genai'
import { DEFAULT_MODEL } from '@/lib/gemini-models'

// The client automatically gets the API key from the environment variable GEMINI_API_KEY
const ai = new GoogleGenAI({})

/**
 * Get the selected model from settings (stored in request headers or use default)
 * For now, we'll use a server action that accepts model as parameter
 */
function getModelName(modelId?: string): string {
  // If modelId is provided, use it; otherwise use default
  return modelId || DEFAULT_MODEL
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error: any) {
      const isLastAttempt = i === maxRetries - 1
      const isNetworkError = error?.message?.includes('fetch failed') || 
                            error?.message?.includes('network') ||
                            error?.cause?.code === 'ECONNREFUSED' ||
                            error?.cause?.code === 'ETIMEDOUT'
      
      if (isLastAttempt || !isNetworkError) {
        throw error
      }
      
      console.log(`[AI] Retry attempt ${i + 1}/${maxRetries} after ${delay}ms`)
      await new Promise(resolve => setTimeout(resolve, delay))
      delay *= 2 // Exponential backoff
    }
  }
  throw new Error('Max retries exceeded')
}

export async function generateText(
  prompt: string,
  modelId?: string
): Promise<string> {
  try {
    const modelName = getModelName(modelId)
    console.log(`[AI] Using model: ${modelName}`)
    
    // Use retry mechanism for network errors
    const response = await retryWithBackoff(async () => {
      return await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      })
    })
    
    const text = response.text

    if (!text) {
      throw new Error('No text generated from Gemini API response')
    }

    return text!
  } catch (error: any) {
    console.error('[AI] Error generating text with Gemini:', error)
    console.error('[AI] Error details:', {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      statusText: error?.statusText,
      cause: error?.cause,
      stack: error?.stack,
      model: modelId || DEFAULT_MODEL,
      errorString: String(error)
    })
    
    // Check for network errors
    if (error?.message?.includes('fetch failed') || 
        error?.message?.includes('network') ||
        error?.cause?.code === 'ECONNREFUSED' ||
        error?.cause?.code === 'ETIMEDOUT') {
      throw new Error('Network error: Unable to connect to Gemini API. Please check your internet connection and try again.')
    }
    
    // Check for specific error types
    if (error?.message?.includes('MODEL_NOT_FOUND') || error?.message?.includes('404')) {
      throw new Error(`Model "${modelId || DEFAULT_MODEL}" not found. Please check the model name in settings.`)
    }
    
    if (error?.message?.includes('API_KEY') || error?.message?.includes('401') || error?.message?.includes('403')) {
      throw new Error('Invalid or missing API key. Please check your GEMINI_API_KEY environment variable.')
    }
    
    // Provide more detailed error message
    const errorMessage = error?.message || error?.toString() || 'Unknown error occurred'
    throw new Error(`Failed to generate text: ${errorMessage}`)
  }
}

export async function generateTranslation(
  text: string,
  modelId?: string
): Promise<string> {
  try {
    const modelName = getModelName(modelId)
    console.log(`[AI Translation] Using model: ${modelName}`)
    
    const prompt = `Translate this Chinese social media script to English. Use casual, trendy US English suitable for Instagram/TikTok.\n\n${text}`
    
    // Use retry mechanism for network errors
    const response = await retryWithBackoff(async () => {
      return await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      })
    })
    
    const translatedText = response.text

    if (!translatedText) {
      throw new Error('No translation generated from Gemini API response')
    }

    return translatedText!
  } catch (error: any) {
    console.error('[AI Translation] Error generating translation with Gemini:', error)
    console.error('[AI Translation] Error details:', {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      statusText: error?.statusText,
      cause: error?.cause,
      stack: error?.stack,
      model: modelId || DEFAULT_MODEL,
      errorString: String(error)
    })
    
    // Check for network errors
    if (error?.message?.includes('fetch failed') || 
        error?.message?.includes('network') ||
        error?.cause?.code === 'ECONNREFUSED' ||
        error?.cause?.code === 'ETIMEDOUT') {
      throw new Error('Network error: Unable to connect to Gemini API. Please check your internet connection and try again.')
    }
    
    // Check for specific error types
    if (error?.message?.includes('MODEL_NOT_FOUND') || error?.message?.includes('404')) {
      throw new Error(`Model "${modelId || DEFAULT_MODEL}" not found. Please check the model name in settings.`)
    }
    
    if (error?.message?.includes('API_KEY') || error?.message?.includes('401') || error?.message?.includes('403')) {
      throw new Error('Invalid or missing API key. Please check your GEMINI_API_KEY environment variable.')
    }
    
    // Provide more detailed error message
    const errorMessage = error?.message || error?.toString() || 'Unknown error occurred'
    throw new Error(`Failed to generate translation: ${errorMessage}`)
  }
}

