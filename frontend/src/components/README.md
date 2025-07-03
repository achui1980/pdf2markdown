# 前端组件重构说明

## 重构概述

原来的 `App.js` 文件超过 600 行代码，包含了所有功能逻辑。现在已经重构为模块化的组件结构，提高了代码的可维护性和复用性。

## 新的目录结构

```
src/
├── components/
│   ├── common/              # 通用组件
│   │   ├── ErrorBoundary.js    # 错误边界组件
│   │   ├── NotificationManager.js  # 通知管理
│   │   └── StepIndicator.js    # 步骤指示器
│   ├── upload/              # 上传相关组件
│   │   └── FileUploader.js     # 文件上传组件
│   ├── processing/          # 处理相关组件
│   │   └── ProcessingView.js   # 处理进度视图
│   ├── results/             # 结果展示组件
│   │   ├── PDFViewer.js        # PDF预览组件
│   │   ├── MarkdownViewer.js   # Markdown预览组件
│   │   ├── ViewToolbar.js      # 视图工具栏
│   │   └── ResultsView.js      # 结果视图容器
│   └── index.js             # 组件导出索引
├── hooks/                   # 自定义Hook
│   └── useFileUpload.js        # 文件上传逻辑Hook
├── utils/                   # 工具函数
│   └── fileUtils.js            # 文件处理工具
└── App.js                   # 主应用组件（重构后）
```

## 重构优势

### 1. 代码分离
- **原来**: 一个文件 600+ 行代码
- **现在**: 每个组件 30-100 行代码，职责单一

### 2. 可维护性
- 每个组件都有明确的职责
- 更容易定位和修复问题
- 更容易添加新功能

### 3. 可复用性
- 组件可以在其他项目中复用
- 便于单元测试
- 符合React最佳实践

### 4. 性能优化
- 组件可以独立优化
- 更好的代码分割可能性
- 减少不必要的重渲染

## 组件详细说明

### 通用组件 (common/)

#### ErrorBoundary.js
- **职责**: 捕获渲染错误，提供错误回退UI
- **特点**: 类组件，实现错误边界

#### NotificationManager.js
- **职责**: 统一管理成功和错误消息通知
- **Props**: `error`, `success`, `onCloseError`, `onCloseSuccess`

#### StepIndicator.js
- **职责**: 显示转换流程的步骤指示器
- **Props**: `activeStep`

### 上传组件 (upload/)

#### FileUploader.js
- **职责**: 处理文件拖拽和选择功能
- **Props**: `isDragOver`, `onDragOver`, `onDragLeave`, `onDrop`, `onFileSelect`
- **特点**: 集成拖拽功能，styled-components样式

### 处理组件 (processing/)

#### ProcessingView.js
- **职责**: 显示文件处理进度和状态
- **Props**: `pdfFile`, `loading`, `processingProgress`, `processingStatus`, `onUpload`, `onReset`
- **特点**: 动态进度条，状态文本显示

### 结果组件 (results/)

#### PDFViewer.js
- **职责**: PDF文件预览显示
- **Props**: `pdfUrl`, `numPages`, `onLoadSuccess`, `onLoadError`, `onFullscreen`, `width`
- **特点**: 支持多页面渲染，全屏预览

#### MarkdownViewer.js
- **职责**: Markdown内容预览和渲染
- **Props**: `markdown`
- **特点**: 显示字符数统计

#### ViewToolbar.js
- **职责**: 视图切换和操作工具栏
- **Props**: `viewMode`, `onViewModeChange`, `onCopy`, `onDownload`, `onReset`

#### ResultsView.js
- **职责**: 结果展示的容器组件
- **特点**: 组合PDF和Markdown预览，管理视图模式

### 自定义Hook

#### useFileUpload.js
- **职责**: 封装文件上传逻辑和状态管理
- **返回值**: `{ loading, processingStatus, processingProgress, uploadFile, reset }`
- **特点**: 将复杂的上传逻辑从组件中抽离

### 工具函数

#### fileUtils.js
- **downloadMarkdown**: 下载Markdown文件
- **copyToClipboard**: 复制到剪贴板
- **validatePDFFile**: 文件验证

## 使用示例

```jsx
// 使用重构后的组件
import { FileUploader, ProcessingView, ResultsView } from './components';
import { useFileUpload } from './hooks/useFileUpload';

function MyComponent() {
    const { loading, uploadFile } = useFileUpload();
    
    return (
        <div>
            <FileUploader onFileSelect={handleFileSelect} />
            <ProcessingView loading={loading} onUpload={uploadFile} />
            <ResultsView markdown={markdown} pdfUrl={pdfUrl} />
        </div>
    );
}
```

## 迁移指南

如果需要修改功能：

1. **修改上传逻辑**: 编辑 `hooks/useFileUpload.js`
2. **修改UI样式**: 编辑对应的组件文件
3. **添加新功能**: 创建新的组件文件
4. **修改工具函数**: 编辑 `utils/fileUtils.js`

## 性能优化建议

1. 使用 `React.memo` 包装不经常变化的组件
2. 使用 `useCallback` 和 `useMemo` 优化回调函数
3. 考虑使用 `React.lazy` 进行代码分割
4. 添加组件级别的错误边界

## 测试建议

每个组件都可以独立测试：

```jsx
// 测试示例
import { render, screen } from '@testing-library/react';
import FileUploader from './components/upload/FileUploader';

test('renders file uploader', () => {
    render(<FileUploader onFileSelect={jest.fn()} />);
    expect(screen.getByText('拖拽PDF文件到此处')).toBeInTheDocument();
});
```

这种模块化的结构使得每个组件都更容易理解、测试和维护。
