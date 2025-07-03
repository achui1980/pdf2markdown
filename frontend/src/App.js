import React, { useState } from 'react';
import { pdfjs } from 'react-pdf';
import {
    Box,
    Container,
    Typography,
    AppBar,
    Toolbar,
    Chip,
    Fab
} from '@mui/material';
import {
    Transform,
    GetApp
} from '@mui/icons-material';

// Components
import ErrorBoundary from './components/common/ErrorBoundary';
import NotificationManager from './components/common/NotificationManager';
import StepIndicator from './components/common/StepIndicator';
import GlobalDragOverlay from './components/common/GlobalDragOverlay';
import HelpButton from './components/common/HelpButton';
import SmartHints from './components/common/SmartHints';
import UserPreferences from './components/common/UserPreferences';
import FileUploader from './components/upload/FileUploader';
import ProcessingView from './components/processing/ProcessingView';
import ProcessingStatusCard from './components/processing/ProcessingStatusCard';
import ResultsView from './components/results/ResultsView';
import QuickActions from './components/results/QuickActions';
import { ToastProvider } from './components/common/Toast';

// Hooks and Utils
import { useFileUpload } from './hooks/useFileUpload';
import { useGlobalDragAndDrop } from './hooks/useGlobalDragAndDrop';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useToast } from './hooks/useToast';
import { downloadMarkdown, copyToClipboard, validatePDFFile } from './utils/fileUtils';

// PDF.js worker configuration
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
    const [pdfFile, setPdfFile] = useState(null);
    const [markdown, setMarkdown] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [numPages, setNumPages] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [isDragOver, setIsDragOver] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(false);
    const [userPreferences, setUserPreferences] = useState({});

    const { loading, processingStatus, processingProgress, uploadFile, reset: resetUpload } = useFileUpload();
    const { 
        toasts, 
        showSuccess: showToastSuccess, 
        showError: showToastError, 
        showInfo, 
        closeToast 
    } = useToast();
    
    // 全局拖拽支持
    const { isDragActive } = useGlobalDragAndDrop((file) => {
        if (activeStep === 0) {
            handleFileSelect(file);
        }
    });

    // 键盘快捷键支持
    useKeyboardShortcuts({
        openFile: () => {
            if (activeStep === 0) {
                document.querySelector('input[type="file"]')?.click();
            }
        },
        saveFile: () => {
            if (markdown && pdfFile) {
                handleDownloadMarkdown();
            }
        },
        copyContent: () => {
            if (markdown) {
                handleCopyMarkdown();
            }
        },
        reset: () => {
            if (activeStep > 0) {
                handleReset();
            }
        }
    });

    const handleFileSelect = (file) => {
        try {
            validatePDFFile(file);
            setPdfFile(file);
            setActiveStep(1);
            setError('');
            setMarkdown('');
            setPdfUrl('');
            setShowQuickActions(false);
            
            // 显示智能提示
            if (file.size > 10 * 1024 * 1024) {
                showInfo('检测到大文件，处理时间可能会稍长', { autoHideDuration: 3000 });
            }
            
            showToastSuccess(`已选择文件: ${file.name}`);
        } catch (error) {
            setError(error.message);
            showToastError(error.message);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragOver(false);
        const file = event.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleUpload = async () => {
        try {
            showInfo('开始转换PDF...');
            const result = await uploadFile(pdfFile);
            setMarkdown(result.markdown);
            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
            setPdfUrl(`${apiBaseUrl}${result.pdfUrl}`);
            setActiveStep(2);
            setSuccess('PDF转换成功！');
            setShowQuickActions(true);
            showToastSuccess('🎉 PDF转换完成！');
            
            // 根据用户偏好自动下载
            if (userPreferences.autoDownload) {
                setTimeout(() => {
                    handleDownloadMarkdown();
                }, 1000);
            }
        } catch (error) {
            setError(error.message);
            setActiveStep(1);
            showToastError(`转换失败: ${error.message}`);
        }
    };

    const handleDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        showInfo(`PDF加载成功，共 ${numPages} 页`);
    };

    const handleDocumentLoadError = (error) => {
        console.error('Error loading PDF:', error);
        const errorMsg = 'PDF文件加载失败，请检查文件是否损坏';
        setError(errorMsg);
        showToastError(errorMsg);
    };

    const handleDownloadMarkdown = () => {
        if (markdown && pdfFile) {
            downloadMarkdown(markdown, pdfFile.name);
            setSuccess('Markdown文件已下载！');
            showToastSuccess('📥 Markdown文件已下载！');
        }
    };

    const handleCopyMarkdown = async () => {
        if (markdown) {
            const success = await copyToClipboard(markdown);
            if (success) {
                setSuccess('Markdown内容已复制到剪贴板！');
                showToastSuccess('📋 内容已复制到剪贴板！');
            } else {
                const errorMsg = '复制失败，请手动复制';
                setError(errorMsg);
                showToastError(errorMsg);
            }
        }
    };

    const handleReset = () => {
        setPdfFile(null);
        setMarkdown('');
        setPdfUrl('');
        setNumPages(null);
        setActiveStep(0);
        setError('');
        setSuccess('');
        setShowQuickActions(false);
        resetUpload();
        showInfo('已重置，可以选择新文件');
    };

    // 新增功能处理函数
    const handleShare = async () => {
        if (navigator.share && markdown) {
            try {
                await navigator.share({
                    title: 'PDF转Markdown结果',
                    text: markdown.substring(0, 200) + '...',
                    url: window.location.href
                });
                showToastSuccess('分享成功！');
            } catch (error) {
                showToastError('分享失败');
            }
        }
    };

    const handlePrint = () => {
        if (markdown) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head><title>Markdown转换结果</title></head>
                    <body><pre>${markdown}</pre></body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
            showToastSuccess('打印任务已发送！');
        }
    };

    const handleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    };

    const handlePreferencesChange = (newPreferences) => {
        setUserPreferences(newPreferences);
    };

    return (
        <ToastProvider toasts={toasts} onCloseToast={closeToast}>
            <ErrorBoundary>
                <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
                    {/* 全局拖拽指示器 */}
                    <GlobalDragOverlay isActive={isDragActive && activeStep === 0} />
                    
                    {/* Header */}
                    <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
                        <Toolbar>
                            <Transform sx={{ mr: 2 }} />
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                PDF to Markdown 转换器
                            </Typography>
                            <Chip 
                                label="智能转换" 
                                color="secondary" 
                                size="small" 
                                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                            />
                            {/* 快捷键提示 */}
                            <Chip 
                                label="Ctrl+O 打开 | Ctrl+S 保存 | ESC 重置" 
                                size="small" 
                                variant="outlined"
                                sx={{ 
                                    ml: 1, 
                                    backgroundColor: 'rgba(255,255,255,0.1)', 
                                    color: 'white',
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    fontSize: '0.7rem'
                                }}
                            />
                        </Toolbar>
                    </AppBar>

                    <Container maxWidth="xl" sx={{ py: 4 }}>
                    {/* 进度步骤 */}
                    <StepIndicator activeStep={activeStep} />

                    {/* 文件上传区域 */}
                    {activeStep === 0 && (
                        <FileUploader
                            isDragOver={isDragOver}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onFileSelect={handleFileSelect}
                        />
                    )}

                    {/* 转换处理区域 */}
                    {activeStep === 1 && pdfFile && (
                        <>
                            <ProcessingView
                                pdfFile={pdfFile}
                                loading={loading}
                                processingProgress={processingProgress}
                                processingStatus={processingStatus}
                                onUpload={handleUpload}
                                onReset={handleReset}
                            />
                            
                            {/* 处理状态卡片 */}
                            <ProcessingStatusCard
                                loading={loading}
                                processingProgress={processingProgress}
                                processingStatus={processingStatus}
                                fileName={pdfFile?.name}
                                fileSize={pdfFile?.size}
                                error={error}
                                onCancel={handleReset}
                                onRetry={handleUpload}
                            />
                            
                            {/* 智能提示 */}
                            <SmartHints
                                fileSize={pdfFile?.size}
                                fileName={pdfFile?.name}
                                processingStatus={processingStatus}
                                error={error}
                                onRetry={handleUpload}
                            />
                        </>
                    )}

                    {/* 结果展示区域 */}
                    {activeStep === 2 && markdown && (
                        <>
                            {/* 快速操作工具栏 */}
                            <QuickActions
                                markdown={markdown}
                                onCopy={handleCopyMarkdown}
                                onDownload={handleDownloadMarkdown}
                                onShare={handleShare}
                                onPrint={handlePrint}
                                onFullscreen={handleFullscreen}
                                visible={showQuickActions}
                                onClose={() => setShowQuickActions(false)}
                            />
                            
                            <ResultsView
                                markdown={markdown}
                                pdfUrl={pdfUrl}
                                pdfFile={pdfFile}
                                numPages={numPages}
                                onDocumentLoadSuccess={handleDocumentLoadSuccess}
                                onDocumentLoadError={handleDocumentLoadError}
                                onCopyMarkdown={handleCopyMarkdown}
                                onDownloadMarkdown={handleDownloadMarkdown}
                                onReset={handleReset}
                            />
                        </>
                    )}
                    
                    {/* 用户偏好设置 */}
                    <UserPreferences
                        onPreferencesChange={handlePreferencesChange}
                        disabled={loading}
                    />
                </Container>

                {/* 通知消息 */}
                <NotificationManager
                    error={error}
                    success={success}
                    onCloseError={() => setError('')}
                    onCloseSuccess={() => setSuccess('')}
                />

                {/* 浮动操作按钮 */}
                {markdown && (
                    <Fab
                        color="primary"
                        sx={{ position: 'fixed', bottom: 16, right: 16 }}
                        onClick={handleDownloadMarkdown}
                    >
                        <GetApp />
                    </Fab>
                )}

                {/* 帮助按钮 */}
                <HelpButton />
            </Box>
        </ErrorBoundary>
        </ToastProvider>
    );
}

export default App;