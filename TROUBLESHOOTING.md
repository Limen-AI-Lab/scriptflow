# Troubleshooting Guide

## 前端无法读取数据

### 问题：n8n成功注入数据，但前端无法显示

**原因：** RLS (Row Level Security) 策略只允许认证用户访问，但前端使用匿名key

### 解决方案

#### 方法1：使用SQL修复（推荐）

1. 打开 Supabase Dashboard
2. 进入 SQL Editor: https://supabase.com/dashboard/project/yunrhoxuxrzbcbkrvgjw/sql/new
3. 运行 `fix-rls-policy.sql` 文件中的SQL

或者直接运行：

```sql
-- Drop the existing policy
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON scripts;

-- Create a new policy that allows public access
CREATE POLICY "Allow public access to scripts" ON scripts
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

#### 方法2：使用Supabase CLI

```bash
# 创建迁移文件
supabase migration new fix_rls_policy

# 编辑迁移文件，添加上述SQL

# 推送到远程数据库
supabase db push --linked
```

### 验证修复

运行以下查询检查策略：

```sql
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'scripts';
```

应该看到 `Allow public access to scripts` 策略。

### 其他可能的问题

#### 1. 环境变量未设置

检查 `.env.local` 文件是否存在且包含：
```
NEXT_PUBLIC_SUPABASE_URL=https://yunrhoxuxrzbcbkrvgjw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 2. 重启开发服务器

修改环境变量后需要重启：
```bash
npm run dev
```

#### 3. 检查浏览器控制台

打开浏览器开发者工具，查看Console是否有错误信息。

#### 4. 验证数据是否存在

在Supabase Dashboard的Table Editor中检查 `scripts` 表是否有数据。

### 安全说明

**注意：** 允许公共访问的策略适合开发环境。生产环境应该：
- 使用更严格的RLS策略
- 实现用户认证
- 根据用户角色限制访问

### 生产环境建议

```sql
-- 只允许读取，不允许写入（匿名用户）
CREATE POLICY "Allow public read" ON scripts
  FOR SELECT
  USING (true);

-- 只允许认证用户写入
CREATE POLICY "Allow authenticated write" ON scripts
  FOR INSERT, UPDATE, DELETE
  USING (auth.role() = 'authenticated');
```


