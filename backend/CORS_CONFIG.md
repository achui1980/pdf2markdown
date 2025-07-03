# CORS配置说明

## 当前配置（信任所有URL）

### 方式1：通过环境变量（推荐）
在 `backend/.env` 中设置：
```properties
ALLOWED_ORIGINS=*
```

这种方式会让应用检测到 `*` 并自动允许所有来源访问。

### 方式2：直接修改代码（更直接）
如果需要更简单的配置，可以直接修改 `backend/index.js` 中的CORS配置：

```javascript
// 简单的CORS配置 - 信任所有来源
const corsOptions = {
    origin: true, // 或者直接使用 "*"
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
```

## 配置选项说明

### 信任所有URL
```properties
ALLOWED_ORIGINS=*
```

### 信任特定URL
```properties
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://example.com
```

### 信任本地网络
```properties
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://192.168.1.*:3000
```

## 安全注意事项

⚠️ **开发环境**: 信任所有URL适合开发环境使用
⚠️ **生产环境**: 建议明确指定允许的域名，避免安全风险

## 测试CORS配置

1. 启动后端服务：
```bash
cd backend
npm start
```

2. 检查CORS是否生效：
```bash
curl -H "Origin: http://example.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     http://localhost:3001/api/upload
```

3. 查看后端日志确认CORS允许状态。

## 常见问题

### Q: 仍然有CORS错误？
A: 确保：
- 后端已重启
- 浏览器缓存已清除
- 检查后端日志中的CORS消息

### Q: 需要支持Cookie？
A: 确保设置了 `credentials: true`

### Q: 预检请求失败？
A: 确保支持 OPTIONS 方法
