# PDF to Markdown Backend

这是一个优化后的PDF转Markdown后端服务，使用Express.js和zerox库。

## 新增功能和优化

### 🔒 安全性增强
- **Helmet**: 添加安全头
- **速率限制**: 防止API滥用
- **文件类型验证**: 只允许PDF文件
- **CORS配置**: 配置允许的来源

### 📊 日志系统
- **Winston日志**: 结构化日志记录
- **错误追踪**: 详细的错误信息和堆栈跟踪
- **性能监控**: 处理时间记录

### 🔧 配置管理
- **环境变量**: 使用.env文件配置
- **动态配置**: 支持不同环境的配置

### 🗂️ 文件管理
- **自动清理**: 24小时后自动删除旧文件
- **唯一文件名**: 避免文件名冲突
- **目录自动创建**: 启动时自动创建必要目录

### 🚀 性能优化
- **错误处理**: 完善的错误处理机制
- **资源清理**: 失败时自动清理上传文件
- **健康检查**: 服务状态监控端点

## 环境变量配置

复制 `.env` 文件并配置以下变量：

```env
# 服务端口
PORT=3001

# 运行环境
NODE_ENV=development

# OpenAI API密钥（必需）
OPENAI_API_KEY=your_openai_api_key_here

# 文件上传配置
MAX_FILE_SIZE=52428800  # 50MB
UPLOAD_DIR=uploads
OUTPUT_DIR=output

# 跨域配置
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# 日志级别
LOG_LEVEL=info
```

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
```bash
# 复制环境变量模板
cp .env.example .env
# 编辑 .env 文件，设置你的 OpenAI API Key
```

3. 运行服务：
```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

## API端点

### POST /api/upload
上传PDF文件并转换为Markdown

**请求**:
- Content-Type: multipart/form-data
- Body: PDF文件 (字段名: pdf)

**响应**:
```json
{
  "markdown": "转换后的markdown内容",
  "pdfUrl": "/uploads/filename.pdf",
  "metadata": {
    "pages": 5,
    "fileSize": 1024000,
    "processingTime": 3000,
    "filename": "document.pdf"
  }
}
```

### GET /health
健康检查端点

**响应**:
```json
{
  "status": "OK",
  "timestamp": "2025-07-03T10:00:00.000Z",
  "uptime": 3600
}
```

## 错误代码

- `NO_FILE`: 没有上传文件
- `CONFIG_ERROR`: 服务配置错误（如缺少API密钥）
- `CONVERSION_ERROR`: PDF转换失败
- `FILE_TOO_LARGE`: 文件大小超过限制
- `TOO_MANY_FILES`: 上传文件数量超过限制
- `INVALID_FILE_TYPE`: 文件类型不支持
- `NOT_FOUND`: 接口不存在
- `INTERNAL_ERROR`: 内部服务器错误

## 日志文件

- `error.log`: 只包含错误日志
- `combined.log`: 包含所有日志

## 注意事项

1. 确保设置了有效的OpenAI API密钥
2. 上传的文件会在24小时后自动删除
3. 每个IP每15分钟最多10次上传请求
4. 最大文件大小为50MB
5. 只支持PDF文件格式
