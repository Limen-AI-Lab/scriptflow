/**
 * Google Gemini API Available Models
 * 
 * Reference: https://ai.google.dev/gemini-api/docs/models?hl=zh-cn
 * Last updated: December 2024
 * 
 * IMPORTANT: Model names must match exactly as shown in the official documentation.
 */

export interface GeminiModel {
  id: string
  name: string
  description: string
  maxTokens?: number
  contextWindow?: number
  inputTypes?: string[]
  outputTypes?: string[]
  status: 'stable' | 'preview' | 'experimental' | 'deprecated'
}

export const GEMINI_MODELS: GeminiModel[] = [
  // Gemini 3 Series
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro (Preview)',
    description: '全球领先的多模态理解模型，最强大的智能体和氛围编程模型。支持文本、图片、视频、音频和PDF输入。',
    maxTokens: 65536,
    contextWindow: 1048576,
    inputTypes: ['文本', '图片', '视频', '音频', 'PDF'],
    outputTypes: ['文本'],
    status: 'preview'
  },
  {
    id: 'gemini-3-pro-image-preview',
    name: 'Gemini 3 Pro Image (Preview)',
    description: 'Gemini 3 Pro 图片预览版，支持图片和文字输入，可生成图片和文字输出。',
    maxTokens: 32768,
    contextWindow: 65536,
    inputTypes: ['图片', '文字'],
    outputTypes: ['图片', '文字'],
    status: 'preview'
  },
  // Gemini 2.5 Series
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: '性价比出色的模型，最适合大规模处理、低延迟、高数据量任务。稳定版本，推荐用于生产环境。',
    maxTokens: 8192,
    contextWindow: 1000000,
    inputTypes: ['文本', '图片', '视频', '音频'],
    outputTypes: ['文本'],
    status: 'stable'
  },
  {
    id: 'gemini-2.5-flash-preview-09-2025',
    name: 'Gemini 2.5 Flash (Preview 09/2025)',
    description: 'Gemini 2.5 Flash 预览版，包含最新功能更新。',
    maxTokens: 8192,
    contextWindow: 1000000,
    status: 'preview'
  },
  // Gemini 2.0 Series
  {
    id: 'gemini-2.0-flash-preview',
    name: 'Gemini 2.0 Flash (Preview)',
    description: '第二代快速模型预览版，支持多模态输入。',
    maxTokens: 8192,
    contextWindow: 1000000,
    inputTypes: ['文本', '图片', '视频', '音频'],
    outputTypes: ['文本'],
    status: 'preview'
  },
  {
    id: 'gemini-2.0-flash-preview-image-generation',
    name: 'Gemini 2.0 Flash Image Generation',
    description: 'Gemini 2.0 Flash 图片生成预览版，支持图片生成功能。',
    maxTokens: 8192,
    contextWindow: 32768,
    inputTypes: ['音频', '图片', '视频', '文本'],
    outputTypes: ['文字', '图片'],
    status: 'preview'
  },
  {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash-Lite',
    description: '第二代小型主力模型，可处理100万个词元的上下文窗口。优化了成本效益和延迟时间。',
    maxTokens: 8192,
    contextWindow: 1048576,
    inputTypes: ['音频', '图片', '视频', '文本'],
    outputTypes: ['文本'],
    status: 'stable'
  }
]

export const DEFAULT_MODEL = 'gemini-2.5-flash'

export function getModelById(id: string): GeminiModel | undefined {
  return GEMINI_MODELS.find(model => model.id === id)
}

export function getStableModels(): GeminiModel[] {
  return GEMINI_MODELS.filter(model => model.status === 'stable')
}

export function getPreviewModels(): GeminiModel[] {
  return GEMINI_MODELS.filter(model => model.status === 'preview')
}

