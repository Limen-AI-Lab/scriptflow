# Google Gemini API Documentation Reference

## Official Documentation

- **Main Documentation**: https://ai.google.dev/docs
- **Models Overview**: https://ai.google.dev/models/gemini
- **API Reference**: https://ai.google.dev/api/rest
- **Node.js SDK**: https://ai.google.dev/tutorials/node_quickstart

## Available Models

### Stable Models

1. **gemini-1.5-flash** (Recommended)
   - Fast and efficient
   - Best for most use cases
   - Free tier available
   - Context window: 1M tokens
   - Max output: 8,192 tokens

2. **gemini-1.5-pro**
   - Most capable model
   - Higher quality but slower
   - Context window: 2M tokens
   - Max output: 8,192 tokens

3. **gemini-pro-vision**
   - Multimodal (text + images)
   - Supports image understanding

### Experimental Models

- **gemini-2.0-flash-exp**
  - Latest experimental model
  - Improved performance
  - May have breaking changes

### Deprecated Models

- **gemini-pro** (Legacy)
  - Previous generation
  - Consider upgrading to 1.5 Flash

## Model Selection Guide

### When to use gemini-1.5-flash:
- ✅ General text generation
- ✅ Fast responses needed
- ✅ Cost-sensitive applications
- ✅ Most common use cases

### When to use gemini-1.5-pro:
- ✅ Complex reasoning tasks
- ✅ Long-form content generation
- ✅ Quality over speed
- ✅ Advanced analysis

### When to use gemini-pro-vision:
- ✅ Image analysis
- ✅ Multimodal tasks
- ✅ Content understanding with images

## API Usage Example

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Select model
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash' 
})

// Generate content
const result = await model.generateContent('Your prompt here')
const response = await result.response
const text = response.text()
```

## Rate Limits

- Free tier: 15 requests per minute (RPM)
- Paid tier: Higher limits available

## Pricing

Check current pricing at: https://ai.google.dev/pricing

## Best Practices

1. **Use gemini-1.5-flash for most tasks** - Best balance of speed and quality
2. **Upgrade to gemini-1.5-pro only when needed** - For complex reasoning
3. **Handle errors gracefully** - API may return errors for various reasons
4. **Respect rate limits** - Implement retry logic with exponential backoff
5. **Monitor token usage** - Keep track of input/output tokens for cost management

## Error Handling

Common errors:
- `API_KEY_INVALID` - Check your API key
- `MODEL_NOT_FOUND` - Model name may be incorrect
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `QUOTA_EXCEEDED` - Usage limit reached

## Updates

Models are updated regularly. Check the official documentation for the latest information.

