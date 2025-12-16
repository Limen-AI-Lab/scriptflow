# Gemini API Model Names

如果 `gemini-1.5-flash` 不工作，可以尝试以下模型名称：

## 推荐的模型（按优先级）

1. **gemini-1.5-flash** (推荐) - 快速且免费
2. **gemini-1.5-pro** - 更强大但可能更慢
3. **gemini-pro** - 旧版本（可能已弃用）

## 如何更改模型

编辑 `app/actions/ai.ts` 文件，修改模型名称：

```typescript
// 选项1: gemini-1.5-flash (当前使用)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

// 选项2: gemini-1.5-pro
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

// 选项3: gemini-pro (旧版本)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
```

## 常见错误

### 1. API Key 无效
- 检查 `.env.local` 中的 `GEMINI_API_KEY` 是否正确
- 确认 API Key 在 Google AI Studio 中有效

### 2. 模型不存在
- 某些模型可能需要特定的 API 访问权限
- 尝试使用 `gemini-1.5-flash`（最稳定的免费选项）

### 3. 配额限制
- 检查 Google AI Studio 中的配额使用情况
- 免费层有请求限制

## 测试 API Key

可以在终端测试 API Key：

```bash
curl https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```


