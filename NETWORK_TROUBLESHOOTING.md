# 网络连接问题排查指南

## 错误信息
```
fetch failed
Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```

## 可能的原因和解决方案

### 1. 网络连接问题

**检查网络连接：**
```powershell
# 测试是否能连接到 Google API
Test-NetConnection generativelanguage.googleapis.com -Port 443
```

**解决方案：**
- 检查你的网络连接是否正常
- 尝试访问其他网站确认网络可用
- 如果使用 VPN，尝试断开或切换节点

### 2. 防火墙或代理设置

**检查：**
- 公司网络可能阻止了对 Google API 的访问
- 防火墙规则可能阻止了 HTTPS 连接
- 代理设置可能不正确

**解决方案：**
- 检查防火墙设置
- 如果使用代理，配置 Node.js 使用代理：
  ```bash
  set HTTP_PROXY=http://proxy.example.com:8080
  set HTTPS_PROXY=http://proxy.example.com:8080
  ```

### 3. DNS 解析问题

**检查：**
```powershell
# 测试 DNS 解析
nslookup generativelanguage.googleapis.com
```

**解决方案：**
- 尝试使用不同的 DNS 服务器（如 8.8.8.8）
- 清除 DNS 缓存：
  ```powershell
  ipconfig /flushdns
  ```

### 4. API 服务暂时不可用

**检查：**
- 访问 https://status.cloud.google.com/ 查看 Google Cloud 服务状态
- 检查是否有服务中断公告

**解决方案：**
- 等待服务恢复
- 稍后重试

### 5. Node.js fetch 问题

**检查 Node.js 版本：**
```bash
node --version
```

**解决方案：**
- 确保使用 Node.js 18+（内置 fetch）
- 如果使用旧版本，可能需要安装 node-fetch

### 6. 环境变量问题

**检查：**
- 确认 `.env.local` 文件存在
- 确认 `GEMINI_API_KEY` 已设置
- 重启开发服务器

**解决方案：**
```bash
# 停止服务器 (Ctrl+C)
# 重新启动
npm run dev
```

## 已实现的改进

1. **自动重试机制**：网络错误会自动重试 3 次，使用指数退避
2. **更好的错误信息**：现在会显示更明确的错误提示
3. **详细日志**：服务器端会记录详细的错误信息

## 测试步骤

1. **测试网络连接：**
   ```powershell
   Test-NetConnection generativelanguage.googleapis.com -Port 443
   ```

2. **测试 API 端点：**
   ```powershell
   curl https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
   ```

3. **使用测试页面：**
   - 访问 `http://localhost:3000/test-ai`
   - 尝试不同的模型
   - 查看详细错误信息

## 如果问题持续

1. 检查终端日志中的详细错误信息
2. 尝试使用不同的模型（如 `gemini-2.0-flash-lite`）
3. 检查是否有防火墙或网络限制
4. 联系网络管理员（如果在公司网络）

