# Vercel CLI 快速开始

## ✅ 当前状态

- ✅ Vercel CLI 已安装 (版本 46.0.1)
- ✅ 已登录 (用户: yubinrobb)

## 🚀 下一步操作

### 1. 初始化项目（首次部署）

```powershell
# 在项目根目录运行
vercel
```

这会引导你完成：
- 是否链接到现有项目？选择 **No** (创建新项目)
- 项目名称？输入 **scriptflow** 或按回车使用默认
- 目录？输入 **./** 或按回车
- 是否覆盖设置？选择 **No**

### 2. 添加环境变量

部署后，需要添加环境变量。有两种方式：

#### 方式 A: 通过 CLI 添加（推荐）

```powershell
# 添加 Supabase 配置
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# 添加 Gemini API
vercel env add GEMINI_API_KEY production

# 添加 Minimax API
vercel env add MINIMAX_API_KEY production
vercel env add MINIMAX_GROUP_ID production

# 同时添加到预览环境
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
vercel env add SUPABASE_SERVICE_ROLE_KEY preview
vercel env add GEMINI_API_KEY preview
vercel env add MINIMAX_API_KEY preview
vercel env add MINIMAX_GROUP_ID preview
```

#### 方式 B: 通过 Dashboard 添加

1. 访问: https://vercel.com/your-project/settings/environment-variables
2. 手动添加所有环境变量

### 3. 部署到生产环境

```powershell
# 部署到生产环境
vercel --prod
```

### 4. 查看部署状态

```powershell
# 查看所有部署
vercel ls

# 查看项目信息
vercel inspect
```

## 📝 常用命令

```powershell
# 预览部署（自动创建预览 URL）
vercel

# 生产部署
vercel --prod

# 查看环境变量
vercel env ls

# 查看部署日志
vercel logs [deployment-url]

# 查看当前项目信息
vercel inspect
```

## 🔧 如果项目已存在

如果你已经在 Vercel Dashboard 创建了项目：

```powershell
# 链接到现有项目
vercel link

# 然后部署
vercel --prod
```

## ⚠️ 重要提示

1. **环境变量**: 确保所有环境变量都已添加到 **production** 和 **preview** 环境
2. **首次部署**: 第一次部署会创建预览 URL，确认无误后再部署到生产环境
3. **自动部署**: 如果连接了 GitHub，推送代码会自动触发部署

## 📚 详细文档

查看 [VERCEL_CLI_SETUP.md](./VERCEL_CLI_SETUP.md) 获取完整配置指南。


