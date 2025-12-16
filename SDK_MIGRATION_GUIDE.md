# SDK 迁移指南

## 当前状态

根据 [官方快速入门文档](https://ai.google.dev/gemini-api/docs/quickstart?hl=zh-cn)：

### ✅ 已安装的SDK
- `@google/generative-ai@0.21.0` (旧版，当前使用)
- `@google/genai` (新版，已安装但未使用)

### 📋 配置检查结果

| 项目 | 要求 | 当前状态 | 状态 |
|------|------|----------|------|
| Node.js版本 | >= v18 | v22.17.0 | ✅ 符合 |
| API密钥 | GEMINI_API_KEY | 已配置 | ✅ 符合 |
| SDK安装 | @google/genai | 已安装 | ✅ 符合 |
| 模型名称 | 官方文档 | 已更新 | ✅ 符合 |
| 代码实现 | 官方示例 | 使用旧版SDK | ⚠️ 可优化 |

## 当前实现 (旧版SDK)

```typescript
// app/actions/ai.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(apiKey)
const model = genAI.getGenerativeModel({ model: modelName })
const result = await model.generateContent(prompt)
```

## 官方推荐实现 (新版SDK)

```typescript
// 官方文档示例
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({}) // 自动从环境变量读取
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "Explain how AI works in a few words",
})
```

## 是否需要迁移？

### 旧版SDK仍然支持
- ✅ `@google/generative-ai` 仍然可以正常工作
- ✅ API功能相同
- ✅ 模型名称兼容

### 新版SDK的优势
- ✅ 官方推荐的最新版本
- ✅ 更简洁的API
- ✅ 自动从环境变量读取API密钥
- ✅ 更好的TypeScript支持

## 建议

**如果当前SDK工作正常：**
- 可以继续使用旧版SDK
- 网络错误与SDK版本无关

**如果要迁移到新版SDK：**
- 需要更新 `app/actions/ai.ts` 中的代码
- 测试所有AI功能是否正常

## 网络错误问题

当前的 "fetch failed" 错误是网络连接问题，与SDK版本无关。可能原因：
1. 防火墙阻止连接
2. 代理配置问题
3. DNS解析问题
4. 网络限制

## 下一步

1. **优先解决网络问题**（与SDK无关）
2. **如果网络正常后仍有问题，再考虑迁移SDK**
3. **当前配置基本符合官方要求**


