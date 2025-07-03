# 超时配置优化总结

## 问题描述
前端上传大文件时出现超时错误，主要是因为前端axios请求使用默认超时设置，而后端已经配置了10分钟超时。

## 解决方案

### 1. 前端超时配置

#### axios配置文件 (`frontend/src/config/axios.js`)
- 创建统一的axios实例
- 配置10分钟超时（600000ms）
- 添加请求/响应拦截器用于日志和错误处理
- 使用环境变量控制超时时间

#### 环境变量配置 (`frontend/.env`)
```properties
REACT_APP_REQUEST_TIMEOUT=600000  # 10分钟超时
```

#### useFileUpload钩子优化
- 使用新的axios配置
- 增强超时错误处理
- 支持动态超时配置

### 2. 后端超时配置（已存在）

#### Express超时设置 (`backend/index.js`)
```javascript
req.setTimeout(10 * 60 * 1000); // 10分钟
res.setTimeout(10 * 60 * 1000); // 10分钟
```

#### body-parser配置
```javascript
express.json({ limit: '50mb' })
express.urlencoded({ limit: '50mb', extended: true })
```

### 3. 错误处理优化

#### 前端错误类型识别
- `ECONNABORTED`: axios超时
- `timeout`: 通用超时错误
- 网络连接错误
- 服务器错误

#### 用户友好的错误消息
```javascript
if (error.code === 'ECONNABORTED') {
    errorMessage = '请求超时，文件可能较大或网络较慢，请稍后重试';
}
```

## 配置参数

### 当前超时设置
- **前端请求超时**: 10分钟 (600,000ms)
- **后端处理超时**: 10分钟 (600,000ms)
- **文件大小限制**: 50MB

### 可调整的环境变量
```properties
# 前端
REACT_APP_REQUEST_TIMEOUT=600000

# 后端
UPLOAD_TIMEOUT=600000
FILE_SIZE_LIMIT=50mb
```

## 进一步优化建议

### 1. 动态超时调整
根据文件大小动态调整超时时间：
```javascript
const fileSize = pdfFile.size;
const basetime = 300000; // 5分钟基础时间
const extraTime = Math.max(0, (fileSize / 1024 / 1024 - 10) * 30000); // 每MB增加30秒
const dynamicTimeout = basetime + extraTime;
```

### 2. 进度反馈改进
- 添加实时处理状态
- 显示预估剩余时间
- 提供取消上传功能

### 3. 分片上传
对于超大文件，考虑实现分片上传：
- 将大文件分割成小块
- 逐个上传并合并
- 支持断点续传

### 4. 服务端优化
- 使用流式处理减少内存占用
- 添加处理进度API
- 实现异步处理队列

## 测试验证

### 测试用例
1. **小文件 (<5MB)**: 应在30秒内完成
2. **中等文件 (5-20MB)**: 应在2-5分钟内完成
3. **大文件 (20-50MB)**: 应在5-10分钟内完成
4. **超时场景**: 应显示友好的错误消息

### 验证步骤
1. 启动前后端服务
2. 测试不同大小的PDF文件上传
3. 验证超时错误处理
4. 检查网络连接异常处理

## 监控和日志

### 前端日志
- 请求开始/结束时间
- 文件大小和处理时间
- 错误类型和频率

### 后端日志
- 请求处理时长
- 内存使用情况
- 错误堆栈信息

通过这些优化，应该能有效解决上传超时问题，提升用户体验。
