# WSL后端访问配置指南

## 🎯 问题描述
当后端服务部署在WSL（Windows Subsystem for Linux）中时，Windows主机上的前端需要能够访问WSL中的API服务。

## 🔧 已实施的解决方案

### 1. 后端网络配置优化

#### a) CORS配置增强
- ✅ 支持多种访问源格式
- ✅ 自动识别本地网络IP
- ✅ 支持WSL网络模式
- ✅ 开发环境友好配置

#### b) 服务器绑定配置
```javascript
// 绑定到所有网络接口，而不仅仅是localhost
app.listen(port, '0.0.0.0', () => {
    // 显示所有可用的访问地址
});
```

#### c) 自动网络发现
服务器启动时会显示所有可用的网络接口和访问地址。

### 2. 前端配置优化

#### a) 环境变量配置
```bash
# frontend/.env
REACT_APP_API_BASE_URL=http://127.0.0.1:3001
```

#### b) 动态API地址
前端代码已更新为使用环境变量，而不是硬编码的localhost地址。

## 🚀 使用步骤

### 步骤1: 在WSL中启动后端
```bash
cd /path/to/backend
npm run dev
```

### 步骤2: 查看网络信息
启动后，后端会显示所有可用的访问地址，类似：
```
Backend server listening at http://0.0.0.0:3001
Local access: http://localhost:3001
Network access: http://127.0.0.1:3001
可用的网络接口:
  eth0: http://192.168.1.100:3001
  docker0: http://172.17.0.1:3001
```

### 步骤3: 在Windows中启动前端
```bash
cd frontend
npm start
```

### 步骤4: 验证连接
前端应该能够通过 `127.0.0.1:3001` 访问WSL中的后端服务。

## 🛠️ 故障排除

### 问题1: 无法连接到后端
**解决方案:**
1. 确认后端绑定到 `0.0.0.0` 而不是 `127.0.0.1`
2. 检查Windows防火墙设置
3. 尝试不同的IP地址（从后端启动日志中选择）

### 问题2: CORS错误
**解决方案:**
1. 检查 `.env` 文件中的 `ALLOWED_ORIGINS` 配置
2. 确认前端访问地址在允许列表中
3. 查看后端日志中的CORS消息

### 问题3: 网络策略限制
**解决方案:**
1. 检查公司网络策略
2. 尝试使用VPN连接
3. 使用WSL2的端口转发功能

## 📝 备选方案

### 方案1: WSL端口转发
如果直接访问不工作，可以使用端口转发：
```powershell
# 在Windows PowerShell中（管理员权限）
netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=WSL_IP
```

### 方案2: 使用WSL2的localhost转发
WSL2会自动将localhost请求转发到WSL，所以有时候直接使用localhost也能工作。

### 方案3: Docker化部署
考虑将整个应用Docker化，使用docker-compose管理网络。

## 🔍 网络检查工具

使用提供的脚本检查网络配置：
```bash
# 在WSL中运行
./wsl-network-setup.sh
```

## 📊 监控和日志

后端会记录所有的网络访问和CORS请求，便于调试：
- ✅ 成功的访问会被记录
- ⚠️ 被阻止的访问会显示警告
- 🔍 网络接口信息会在启动时显示

## 🎉 验证成功

当配置正确时，你应该看到：
1. 后端启动时显示多个访问地址
2. 前端能够成功调用API
3. 没有CORS错误
4. 文件上传和转换功能正常工作
