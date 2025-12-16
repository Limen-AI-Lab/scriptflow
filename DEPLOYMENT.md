# 部署指南 - GitHub & Vercel

本指南将帮助你创建 GitHub 仓库并将项目部署到 Vercel。

## 步骤 1: 创建 GitHub 仓库

### 方法 1: 使用 GitHub CLI (推荐)

```powershell
# 安装 GitHub CLI (如果还没有)
# winget install GitHub.cli

# 登录 GitHub
gh auth login

# 创建仓库并推送代码
gh repo create scriptflow --public --source=. --remote=origin --push
```

### 方法 2: 使用 GitHub 网页界面

1. **访问 GitHub**: https://github.com/new
2. **创建新仓库**:
   - Repository name: `scriptflow` (或你喜欢的名字)
   - Description: "A Next.js application for managing and editing social media scripts with AI-powered features"
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README" (我们已经有了)
   - 点击 "Create repository"

3. **在本地初始化并推送**:
```powershell
# 初始化 git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: ScriptFlow project"

# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/scriptflow.git

# 推送代码
git branch -M main
git push -u origin main
```

## 步骤 2: 部署到 Vercel

### 方法 1: 通过 Vercel Dashboard (推荐)

1. **访问 Vercel**: https://vercel.com
2. **登录/注册** (可以使用 GitHub 账号登录)
3. **导入项目**:
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库 `scriptflow`
   - 点击 "Import"

4. **配置项目**:
   - **Framework Preset**: Next.js (自动检测)
   - **Root Directory**: `./` (默认)
   - **Build Command**: `npm run build` (默认)
   - **Output Directory**: `.next` (默认)
   - **Install Command**: `npm install` (默认)

5. **配置环境变量**:
   在 "Environment Variables" 部分添加以下变量：

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   GEMINI_API_KEY=your_gemini_api_key
   MINIMAX_API_KEY=your_minimax_api_key
   MINIMAX_GROUP_ID=your_minimax_group_id
   ```

6. **部署**:
   - 点击 "Deploy"
   - 等待构建完成
   - 访问你的部署 URL (例如: `https://scriptflow.vercel.app`)

### 方法 2: 使用 Vercel CLI

```powershell
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

## 步骤 3: 配置环境变量

在 Vercel Dashboard 中配置环境变量：

1. 进入项目设置: https://vercel.com/your-project/settings
2. 点击 "Environment Variables"
3. 添加所有必需的环境变量（见上方列表）
4. 为每个环境选择作用域（Production, Preview, Development）

## 步骤 4: 配置 Supabase

确保 Supabase 项目允许来自 Vercel 域名的请求：

1. 进入 Supabase Dashboard
2. 进入 Settings → API
3. 在 "Allowed URLs" 中添加你的 Vercel 域名:
   - `https://your-project.vercel.app`
   - `https://*.vercel.app` (用于预览部署)

## 步骤 5: 验证部署

1. 访问你的 Vercel URL
2. 检查功能是否正常:
   - 主页是否加载
   - 数据库连接是否正常
   - AI 功能是否工作

## 自动部署

配置完成后，Vercel 会自动：
- ✅ 监听 GitHub 推送
- ✅ 自动构建和部署
- ✅ 为每个 Pull Request 创建预览部署

## 故障排除

### 构建失败

1. **检查环境变量**: 确保所有必需的环境变量都已设置
2. **查看构建日志**: 在 Vercel Dashboard 中查看详细错误
3. **本地测试构建**: 
   ```bash
   npm run build
   ```

### 运行时错误

1. **检查环境变量**: 确保 `NEXT_PUBLIC_*` 变量已设置
2. **查看函数日志**: 在 Vercel Dashboard → Functions 中查看
3. **检查网络连接**: 确保 Vercel 可以访问 Supabase 和 Gemini API

### 数据库连接问题

1. **检查 RLS 策略**: 确保允许公共访问或配置正确的策略
2. **检查 CORS 设置**: 在 Supabase 中添加 Vercel 域名到允许列表

## 有用的链接

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repository**: https://github.com/YOUR_USERNAME/scriptflow
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel 文档**: https://vercel.com/docs

## 下一步

部署成功后，你可以：
- 配置自定义域名
- 设置 CI/CD 流程
- 配置监控和日志
- 优化性能


