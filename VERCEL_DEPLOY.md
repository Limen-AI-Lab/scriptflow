# Vercel 部署指南

## 快速部署

### 方法 1: 通过 GitHub 集成 (推荐)

1. **访问 Vercel**: https://vercel.com
2. **使用 GitHub 登录**
3. **导入项目**:
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库 `scriptflow`
   - 点击 "Import"

4. **配置项目** (通常自动检测):
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. **添加环境变量** (重要！):
   
   在 "Environment Variables" 部分添加：

   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   GEMINI_API_KEY
   MINIMAX_API_KEY
   MINIMAX_GROUP_ID
   ```

6. **部署**:
   - 点击 "Deploy"
   - 等待构建完成（约 2-3 分钟）

### 方法 2: 使用 Vercel CLI

```powershell
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署（首次会引导配置）
vercel

# 生产环境部署
vercel --prod
```

## 环境变量配置

### 在 Vercel Dashboard 中设置

1. 进入项目: https://vercel.com/your-project
2. 点击 "Settings" → "Environment Variables"
3. 添加以下变量：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase Anon Key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | 你的 Service Role Key | Production, Preview, Development |
| `GEMINI_API_KEY` | 你的 Gemini API Key | Production, Preview, Development |
| `MINIMAX_API_KEY` | 你的 Minimax API Key | Production, Preview, Development |
| `MINIMAX_GROUP_ID` | 你的 Minimax Group ID | Production, Preview, Development |

### 重要提示

- `NEXT_PUBLIC_*` 变量会暴露给客户端，确保只包含公开的密钥
- `SUPABASE_SERVICE_ROLE_KEY` 和 `GEMINI_API_KEY` 是敏感信息，不要提交到 GitHub

## 部署后检查

1. ✅ 访问部署 URL (例如: `https://scriptflow.vercel.app`)
2. ✅ 检查主页是否正常加载
3. ✅ 测试数据库连接（查看是否有数据）
4. ✅ 测试 AI 功能（Fix CTA, Rewrite Hook 等）

## 自动部署

配置完成后：
- ✅ 每次推送到 `main` 分支会自动部署到生产环境
- ✅ 每个 Pull Request 会自动创建预览部署
- ✅ 可以在 Vercel Dashboard 中查看部署历史

## 自定义域名

1. 进入项目 Settings → Domains
2. 添加你的域名
3. 按照提示配置 DNS 记录

## 故障排除

### 构建失败

1. 检查环境变量是否全部设置
2. 查看构建日志中的错误信息
3. 本地测试: `npm run build`

### 运行时错误

1. 检查函数日志: Dashboard → Functions
2. 确认环境变量已正确设置
3. 检查 Supabase RLS 策略

### 网络错误

如果遇到网络连接问题（如 Gemini API），可能需要：
- 检查 Vercel 的网络配置
- 确认 API 服务在 Vercel 的服务器区域可用

## 有用的链接

- **Vercel Dashboard**: https://vercel.com/dashboard
- **项目设置**: https://vercel.com/your-project/settings
- **环境变量**: https://vercel.com/your-project/settings/environment-variables
- **部署日志**: https://vercel.com/your-project/deployments

