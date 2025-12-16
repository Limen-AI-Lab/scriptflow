# Vercel CLI 配置指南

## 安装 Vercel CLI

### 方法 1: 使用 npm (推荐)

```powershell
# 全局安装
npm install -g vercel

# 验证安装
vercel --version
```

### 方法 2: 使用其他包管理器

```powershell
# 使用 yarn
yarn global add vercel

# 使用 pnpm
pnpm add -g vercel
```

## 登录 Vercel

### 首次登录

```powershell
# 启动登录流程
vercel login
```

这会打开浏览器让你登录，或者你可以使用邮箱登录：

```powershell
# 使用邮箱登录
vercel login your-email@example.com
```

### 检查登录状态

```powershell
# 查看当前登录的用户
vercel whoami
```

## 初始化项目

### 首次部署

在项目根目录运行：

```powershell
# 初始化并部署
vercel
```

这会引导你完成以下步骤：
1. 是否要链接到现有项目？(No - 创建新项目)
2. 项目名称？(scriptflow)
3. 目录？(./)
4. 是否覆盖设置？(No)

### 链接到现有项目

如果你已经在 Vercel Dashboard 创建了项目：

```powershell
# 链接到现有项目
vercel link
```

这会询问：
- **Project name**: 选择或输入项目名
- **Directory**: `./` (当前目录)
- **Settings**: 使用默认设置

## 部署命令

### 预览部署

```powershell
# 部署到预览环境
vercel

# 或明确指定
vercel --preview
```

### 生产部署

```powershell
# 部署到生产环境
vercel --prod

# 或使用别名
vercel production
```

### 其他部署选项

```powershell
# 部署并查看输出
vercel --debug

# 强制重新部署
vercel --force

# 部署到特定环境
vercel --target production
```

## 环境变量配置

### 通过 CLI 添加环境变量

```powershell
# 添加环境变量（所有环境）
vercel env add NEXT_PUBLIC_SUPABASE_URL

# 添加环境变量（仅生产环境）
vercel env add GEMINI_API_KEY production

# 添加环境变量（仅预览环境）
vercel env add GEMINI_API_KEY preview

# 添加环境变量（仅开发环境）
vercel env add GEMINI_API_KEY development
```

### 批量添加环境变量

创建一个 `.env` 文件，然后：

```powershell
# 从 .env 文件导入（需要手动输入每个值）
# 或者使用 vercel env pull 先下载现有变量
vercel env pull .env.local
```

### 查看环境变量

```powershell
# 列出所有环境变量
vercel env ls

# 查看特定环境变量
vercel env ls production
```

### 删除环境变量

```powershell
# 删除环境变量
vercel env rm VARIABLE_NAME production
```

## 项目配置

### 查看项目信息

```powershell
# 查看项目详情
vercel inspect

# 查看部署列表
vercel ls

# 查看特定部署
vercel inspect [deployment-url]
```

### 项目设置

```powershell
# 查看项目配置
cat .vercel/project.json

# 查看链接信息
cat .vercel/README.txt
```

## 完整部署流程示例

### 第一次部署

```powershell
# 1. 安装 CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 在项目目录中初始化
cd C:\Users\Robb\Copy_Writing
vercel

# 4. 添加环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add GEMINI_API_KEY production
# ... 添加其他变量

# 5. 部署到生产环境
vercel --prod
```

### 后续部署

```powershell
# 预览部署（自动）
vercel

# 生产部署
vercel --prod
```

## 常用命令速查

```powershell
# 登录
vercel login

# 查看当前用户
vercel whoami

# 初始化项目
vercel

# 预览部署
vercel

# 生产部署
vercel --prod

# 查看部署列表
vercel ls

# 查看项目信息
vercel inspect

# 添加环境变量
vercel env add VARIABLE_NAME

# 查看环境变量
vercel env ls

# 删除环境变量
vercel env rm VARIABLE_NAME production

# 查看日志
vercel logs [deployment-url]

# 移除项目链接
vercel unlink
```

## 故障排除

### CLI 未找到

```powershell
# 确保全局安装
npm install -g vercel

# 检查 PATH 环境变量
$env:PATH -split ';' | Select-String npm
```

### 登录失败

```powershell
# 清除登录信息并重新登录
vercel logout
vercel login
```

### 项目链接问题

```powershell
# 移除现有链接
vercel unlink

# 重新链接
vercel link
```

### 环境变量未生效

```powershell
# 确保变量已添加到正确的环境
vercel env ls production

# 重新部署以应用新变量
vercel --prod --force
```

## 与 GitHub 集成

如果你已经通过 GitHub 连接了项目：

```powershell
# CLI 部署会创建新的部署，但不会触发 GitHub 集成
# 通过 GitHub push 的部署仍然会正常进行

# 查看所有部署（包括 GitHub 触发的）
vercel ls
```

## 最佳实践

1. **使用 `.vercelignore`**: 创建 `.vercelignore` 文件排除不需要的文件
2. **环境变量管理**: 使用 `vercel env` 命令管理环境变量，不要提交到 Git
3. **预览部署**: 使用 `vercel` 进行预览，确认无误后再 `vercel --prod`
4. **查看日志**: 使用 `vercel logs` 调试部署问题

## 相关文件

- `vercel.json` - Vercel 配置文件
- `.vercel/` - Vercel 项目链接信息（不要提交到 Git）
- `.vercelignore` - 排除文件列表（可选）

## 更多资源

- [Vercel CLI 文档](https://vercel.com/docs/cli)
- [Vercel 环境变量文档](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel 部署文档](https://vercel.com/docs/concepts/deployments)


