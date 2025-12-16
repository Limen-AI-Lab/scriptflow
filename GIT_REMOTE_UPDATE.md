# Git 远程仓库更新指南

## ✅ 已完成

远程仓库 URL 已更新为：
- **新地址**: `https://github.com/Liman-AI-Lab/scriptflow.git`
- **旧地址**: `https://github.com/yubinyang-limenlab/scriptflow.git`

## 🚀 推送代码

### 方法 1: 使用 HTTPS（需要认证）

```powershell
# 推送代码
git push origin master
```

如果遇到认证问题，GitHub 现在要求使用 Personal Access Token (PAT)：

1. **创建 Personal Access Token**:
   - 访问: https://github.com/settings/tokens
   - 点击 "Generate new token" → "Generate new token (classic)"
   - 选择权限: `repo` (完整仓库访问)
   - 生成并复制 token

2. **使用 token 推送**:
   - 用户名: 你的 GitHub 用户名
   - 密码: 使用刚才生成的 token

### 方法 2: 使用 SSH（推荐）

```powershell
# 1. 检查是否已有 SSH 密钥
ls ~/.ssh

# 2. 如果没有，生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 3. 添加 SSH 密钥到 GitHub
# 复制公钥内容
cat ~/.ssh/id_ed25519.pub
# 然后添加到: https://github.com/settings/keys

# 4. 更新远程 URL 为 SSH
git remote set-url origin git@github.com:Liman-AI-Lab/scriptflow.git

# 5. 推送
git push origin master
```

### 方法 3: 使用 GitHub CLI

```powershell
# 如果已安装 GitHub CLI
gh auth login
git push origin master
```

## 🔍 验证远程仓库

```powershell
# 查看当前远程仓库
git remote -v

# 应该显示:
# origin  https://github.com/Liman-AI-Lab/scriptflow.git (fetch)
# origin  https://github.com/Liman-AI-Lab/scriptflow.git (push)
```

## 📝 如果组织仓库使用不同的分支名

如果组织仓库使用 `main` 而不是 `master`:

```powershell
# 重命名本地分支
git branch -M main

# 推送并设置上游
git push -u origin main
```

## ⚠️ 常见问题

### 网络连接问题

如果遇到 "Failed to connect to github.com"：

1. **检查网络连接**
2. **使用代理**（如果在中国）:
   ```powershell
   git config --global http.proxy http://proxy.example.com:port
   git config --global https.proxy https://proxy.example.com:port
   ```

3. **使用 SSH 代替 HTTPS**

### 权限问题

如果遇到 "Permission denied"：

1. 确认你有组织仓库的写入权限
2. 检查组织设置中的仓库权限
3. 联系组织管理员添加你的访问权限

### 认证问题

如果遇到认证失败：

1. 使用 Personal Access Token 代替密码
2. 或切换到 SSH 认证
3. 或使用 GitHub CLI

## 📚 相关命令

```powershell
# 查看远程仓库
git remote -v

# 更新远程 URL
git remote set-url origin <new-url>

# 添加远程仓库
git remote add origin <url>

# 删除远程仓库
git remote remove origin

# 推送代码
git push origin master
# 或
git push origin main
```


