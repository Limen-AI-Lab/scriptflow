# 网络连接问题解决方案

## 问题确认

测试结果显示：
- ✅ API Key 存在且正确（39字符）
- ✅ SDK 客户端创建成功
- ❌ 网络连接失败：`TypeError: fetch failed sending request`

## 可能的原因

### 1. 防火墙/安全软件阻止
- Windows 防火墙可能阻止了 Node.js 的网络连接
- 杀毒软件可能阻止了连接

### 2. 代理设置
- 如果使用公司网络，可能需要配置代理
- Node.js 可能没有使用系统代理设置

### 3. 网络限制
- 某些地区可能无法访问 Google API
- ISP 可能阻止了连接

## 解决方案

### 方案1：配置代理（如果使用代理）

在 `.env.local` 中添加：
```bash
HTTP_PROXY=http://proxy.example.com:8080
HTTPS_PROXY=http://proxy.example.com:8080
NO_PROXY=localhost,127.0.0.1
```

### 方案2：检查防火墙设置

1. 打开 Windows 防火墙设置
2. 允许 Node.js 通过防火墙
3. 或者临时禁用防火墙测试

### 方案3：使用系统代理

Node.js 默认不自动使用系统代理。可以：

1. **设置环境变量**（在 PowerShell 中）：
```powershell
$env:HTTP_PROXY = "http://proxy:port"
$env:HTTPS_PROXY = "http://proxy:port"
```

2. **或在代码中配置**（如果需要）

### 方案4：检查网络连接

```powershell
# 测试 DNS 解析
nslookup generativelanguage.googleapis.com

# 测试 HTTPS 连接
Test-NetConnection generativelanguage.googleapis.com -Port 443
```

### 方案5：使用 VPN

如果网络限制导致无法访问，可以：
- 使用 VPN 连接
- 切换到其他网络环境

## 临时测试

可以尝试在浏览器中直接访问：
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```

如果浏览器也无法访问，说明是网络层面的问题。

## 代码已正确配置

✅ SDK 已更新到最新版本
✅ API 调用方式符合官方文档
✅ 错误处理已完善
✅ 重试机制已实现

问题在于网络连接，不是代码问题。


