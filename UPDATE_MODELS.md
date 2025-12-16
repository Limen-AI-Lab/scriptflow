# 如何更新 Gemini 模型列表

## 查看最新模型

1. **访问官方文档**：
   - https://ai.google.dev/models/gemini
   - https://ai.google.dev/api/rest

2. **在 Google AI Studio 查看**：
   - https://aistudio.google.com/
   - 登录后可以看到所有可用的模型

3. **检查模型名称格式**：
   - 模型名称通常是：`gemini-X.Y-flash` 或 `gemini-X.Y-pro`
   - 实验性模型可能带有 `-exp` 后缀
   - 例如：`gemini-2.5-flash`, `gemini-2.5-pro`

## 更新步骤

1. **编辑 `lib/gemini-models.ts`**
2. **更新 `GEMINI_MODELS` 数组**，添加或修改模型信息
3. **更新 `DEFAULT_MODEL`** 为推荐的默认模型
4. **测试模型是否可用**

## 模型命名规则

根据 Google 的命名约定：
- `gemini-2.5-flash` - 最新快速模型
- `gemini-2.5-pro` - 最新强大模型
- `gemini-1.5-flash` - 稳定快速模型
- `gemini-1.5-pro` - 稳定强大模型
- `gemini-exp-XXXX` - 实验性模型（日期格式）

## 验证模型名称

如果某个模型名称不工作，检查：
1. 模型名称是否正确（大小写敏感）
2. 你的 API key 是否有权限访问该模型
3. 模型是否还在可用列表中

## 常见问题

**Q: 为什么我的模型名称不工作？**
A: 模型名称必须完全匹配 API 文档中的名称。检查官方文档确认。

**Q: 如何知道哪些模型可用？**
A: 访问 https://ai.google.dev/models/gemini 查看最新列表。

**Q: 实验性模型安全吗？**
A: 实验性模型可能有变化，建议生产环境使用稳定版本。

