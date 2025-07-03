import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Collapse,
    Alert,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Divider
} from '@mui/material';
import {
    CheckCircle,
    Error,
    Warning,
    Info,
    ExpandMore,
    ExpandLess,
    Refresh
} from '@mui/icons-material';

// 智能提示组件
const SmartHints = ({ 
    fileSize, 
    fileName, 
    processingStatus, 
    error,
    onRetry 
}) => {
    const [hints, setHints] = useState([]);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const generateHints = () => {
            const newHints = [];

            // 文件大小提示
            if (fileSize > 10 * 1024 * 1024) { // 大于10MB
                newHints.push({
                    type: 'warning',
                    icon: <Warning />,
                    title: '大文件处理',
                    message: '您的文件较大，处理时间可能会稍长，请耐心等待',
                    suggestion: '建议在处理期间不要关闭浏览器窗口'
                });
            }

            // 文件类型提示
            if (fileName && fileName.toLowerCase().includes('scan')) {
                newHints.push({
                    type: 'info',
                    icon: <Info />,
                    title: '扫描文档识别',
                    message: '检测到可能是扫描文档，AI将使用OCR技术识别文字',
                    suggestion: '扫描质量越高，识别准确率越好'
                });
            }

            // 错误处理提示
            if (error) {
                if (error.includes('网络')) {
                    newHints.push({
                        type: 'error',
                        icon: <Error />,
                        title: '网络连接问题',
                        message: '网络连接不稳定，请检查网络后重试',
                        suggestion: '建议切换到稳定的网络环境'
                    });
                } else if (error.includes('格式')) {
                    newHints.push({
                        type: 'error',
                        icon: <Error />,
                        title: '文件格式问题',
                        message: '文件可能损坏或格式不正确',
                        suggestion: '请确保文件是有效的PDF格式'
                    });
                } else {
                    newHints.push({
                        type: 'error',
                        icon: <Error />,
                        title: '处理异常',
                        message: '服务器处理时出现异常',
                        suggestion: '请稍后重试，如果问题持续存在请联系支持'
                    });
                }
            }

            // 成功提示
            if (processingStatus === 'success') {
                newHints.push({
                    type: 'success',
                    icon: <CheckCircle />,
                    title: '转换成功',
                    message: 'PDF已成功转换为Markdown格式',
                    suggestion: '您可以预览、复制或下载转换结果'
                });
            }

            // 性能优化提示
            if (processingStatus === 'processing') {
                newHints.push({
                    type: 'info',
                    icon: <Info />,
                    title: '处理中',
                    message: 'AI正在智能分析您的文档结构和内容',
                    suggestion: '复杂文档可能需要更多时间来确保转换质量'
                });
            }

            setHints(newHints);
        };

        generateHints();
    }, [fileSize, fileName, processingStatus, error]);

    const getAlertSeverity = (type) => {
        switch (type) {
            case 'error': return 'error';
            case 'warning': return 'warning';
            case 'success': return 'success';
            default: return 'info';
        }
    };

    if (hints.length === 0) return null;

    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        💡 智能提示
                        <Chip label={hints.length} size="small" color="primary" />
                    </Typography>
                    <Button
                        size="small"
                        endIcon={showDetails ? <ExpandLess /> : <ExpandMore />}
                        onClick={() => setShowDetails(!showDetails)}
                    >
                        {showDetails ? '收起' : '展开'}
                    </Button>
                </Box>

                {/* 主要提示 */}
                {hints.slice(0, 1).map((hint, index) => (
                    <Alert 
                        key={index}
                        severity={getAlertSeverity(hint.type)}
                        icon={hint.icon}
                        sx={{ mb: 1 }}
                        action={
                            hint.type === 'error' && onRetry ? (
                                <Button 
                                    color="inherit" 
                                    size="small" 
                                    onClick={onRetry}
                                    startIcon={<Refresh />}
                                >
                                    重试
                                </Button>
                            ) : null
                        }
                    >
                        <Typography variant="subtitle2" gutterBottom>
                            {hint.title}
                        </Typography>
                        <Typography variant="body2">
                            {hint.message}
                        </Typography>
                    </Alert>
                ))}

                {/* 详细提示 */}
                <Collapse in={showDetails}>
                    {hints.length > 1 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <List dense>
                                {hints.slice(1).map((hint, index) => (
                                    <ListItem key={index + 1}>
                                        <ListItemIcon>
                                            {hint.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={hint.title}
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" component="span">
                                                        {hint.message}
                                                    </Typography>
                                                    {hint.suggestion && (
                                                        <Typography 
                                                            variant="caption" 
                                                            display="block" 
                                                            sx={{ mt: 0.5, fontStyle: 'italic' }}
                                                        >
                                                            💡 {hint.suggestion}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
                </Collapse>
            </CardContent>
        </Card>
    );
};

export default SmartHints;
