# 快速部署指南 🚀

## 5 分钟快速部署

### 步骤 1: 创建 GitHub 仓库 (2 分钟)

#### 使用 GitHub CLI (最快)

```powershell
# 安装 GitHub CLI (如果还没有)
winget install GitHub.cli

# 登录
gh auth login

# 创建并推送仓库
gh repo create scriptflow --public --source=. --remote=origin --push
```

#### 或使用网页界面

1. 访问: https://github.com/new
2. 仓库名: `scriptflow`
3. 点击 "Create repository"
4. 运行以下命令:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/scriptflow.git
git branch -M main
git push -u origin main
```

### 步骤 2: 部署到 Vercel (3 分钟)

1. **访问**: https://vercel.com
2. **登录**: 使用 GitHub 账号
3. **导入项目**:
   - 点击 "Add New..." → "Project"
   - 选择 `scriptflow` 仓库
   - 点击 "Import"

4. **配置环境变量** (重要！):

   在 "Environment Variables" 中添加:

   ```
   NEXT_PUBLIC_SUPABASE_URL = 你的 Supabase URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY = 你的 Supabase Anon Key
   SUPABASE_SERVICE_ROLE_KEY = 你的 Service Role Key
   GEMINI_API_KEY = 你的 Gemini API Key
   MINIMAX_API_KEY = 你的 Minimax API Key
   MINIMAX_GROUP_ID = 你的 Minimax Group ID
   ```

5. **部署**: 点击 "Deploy"

6. **等待**: 约 2-3 分钟构建完成

### 步骤 3: 完成 ✅

访问你的部署 URL (例如: `https://scriptflow.vercel.app`)

## 详细文档

- 📖 [完整部署指南](./DEPLOYMENT.md)
- 🐙 [GitHub 设置](./GITHUB_SETUP.md)
- ▲ [Vercel 部署](./VERCEL_DEPLOY.md)

## 需要帮助？

如果遇到问题，查看:
- [故障排除指南](./TROUBLESHOOTING.md)
- [网络问题排查](./NETWORK_TROUBLESHOOTING.md)

