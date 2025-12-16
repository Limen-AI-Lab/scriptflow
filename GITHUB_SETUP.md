# GitHub 仓库设置指南

## 快速开始

### 步骤 1: 创建 GitHub 仓库

#### 选项 A: 使用 GitHub CLI (最快)

```powershell
# 如果还没有安装 GitHub CLI
# winget install GitHub.cli

# 登录 GitHub
gh auth login

# 创建仓库并推送
gh repo create scriptflow --public --source=. --remote=origin --push
```

#### 选项 B: 使用 GitHub 网页

1. 访问 https://github.com/new
2. 填写信息：
   - **Repository name**: `scriptflow`
   - **Description**: "AI-powered social media script editor"
   - **Visibility**: Public 或 Private
   - **不要**勾选任何初始化选项
3. 点击 "Create repository"

4. 然后运行以下命令：

```powershell
# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/scriptflow.git

# 重命名分支为 main
git branch -M main

# 推送代码
git push -u origin main
```

### 步骤 2: 验证

访问你的 GitHub 仓库，确认所有文件都已上传。

## 后续推送

```powershell
git add .
git commit -m "Your commit message"
git push
```

