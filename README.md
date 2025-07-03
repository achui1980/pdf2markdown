# PDF to Markdown Converter

一个强大的PDF转Markdown工具，支持高质量的文档转换和现代化的用户界面。

## 项目概述

- **后端**: Node.js + Express，处理文件上传和PDF转换
- **前端**: React + Material-UI，提供现代化的用户界面
- **核心功能**: 使用 `zerox` 和 OpenAI API 进行智能PDF转换

## 功能特点

### 🚀 核心功能
- PDF文件上传和转换为Markdown
- 支持大文件处理（最大50MB）
- 智能错误处理和重试机制
- 实时转换进度显示

### 🎨 用户体验
- 现代化Material-UI界面
- 全屏拖拽上传
- 快捷键支持（Ctrl+O打开文件）
- 智能文件验证提示
- Toast通知系统

### 🔧 技术特性
- 跨域CORS配置支持
- WSL/Windows跨环境访问
- 网络超时和重试配置
- 环境变量配置管理
- 详细的错误日志

## 快速开始

### 环境要求
- Node.js 16+ 和 npm
- OpenAI API密钥

### 安装和配置

1. **克隆项目**
   ```bash
   git clone [your-repo-url]
   cd pdf2markdown
   ```

2. **配置环境变量**
   ```bash
   # 复制环境变量模板
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # 编辑配置文件，填写你的OpenAI API密钥
   ```

3. **安装依赖**
   ```bash
   # 安装后端依赖
   cd backend
   npm install
   
   # 安装前端依赖
   cd ../frontend
   npm install
   ```

### 运行项目

1. **启动后端服务**
   ```bash
   cd backend
   npm start
   ```
   服务器将运行在 `http://localhost:3001`

2. **启动前端应用**
   ```bash
   cd frontend
   npm start
   ```
   应用将在 `http://localhost:3000` 打开

## 使用方法

1. **上传PDF文件**
   - 点击上传区域选择文件
   - 或直接拖拽PDF文件到上传区域
   - 使用快捷键 `Ctrl+O` 快速打开文件

2. **转换处理**
   - 系统会自动验证文件格式和大小
   - 显示实时转换进度
   - 完成后可预览和下载Markdown结果

## 配置说明

### 环境变量配置

**后端配置 (backend/.env)**
```properties
# API配置
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_API_BASE=https://api.openai.com/v1

# 网络配置
HTTPS_PROXY=your_proxy_if_needed
REQUEST_TIMEOUT=120000
MAX_RETRIES=3

# 文件配置
MAX_FILE_SIZE=52428800  # 50MB
UPLOAD_DIR=uploads
OUTPUT_DIR=output

# CORS配置
ALLOWED_ORIGINS=http://localhost:3000
CORS_STRICT_MODE=true
```

**前端配置 (frontend/.env)**
```properties
REACT_APP_API_BASE_URL=http://127.0.0.1:3001
REACT_APP_REQUEST_TIMEOUT=600000
```

## 故障排除

### WSL环境访问问题
如果在WSL环境中运行后端，请参考 `backend/WSL_ACCESS_GUIDE.md`。

### 超时问题
大文件上传超时配置优化请查看 `frontend/TIMEOUT_OPTIMIZATION.md`。

### CORS问题
详细的CORS配置说明请查看 `backend/CORS_CONFIG.md`。

## 许可证

本项目采用 MIT 许可证。