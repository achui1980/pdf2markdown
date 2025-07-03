import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    IconButton,
    Tooltip,
    Fade,
    Chip,
    Divider
} from '@mui/material';
import {
    AutoFixHigh,
    ContentCopy,
    Download,
    Share,
    Print,
    Fullscreen,
    Close,
    CheckCircle
} from '@mui/icons-material';

// 快速操作工具栏
const QuickActions = ({ 
    markdown, 
    onCopy, 
    onDownload, 
    onShare,
    onPrint,
    onFullscreen,
    visible = true,
    onClose 
}) => {
    const [actions, setActions] = useState([]);
    const [showSuccess, setShowSuccess] = useState({});

    useEffect(() => {
        const availableActions = [
            {
                id: 'copy',
                label: '复制到剪贴板',
                icon: <ContentCopy />,
                shortcut: 'Ctrl+Shift+C',
                action: async () => {
                    await onCopy?.();
                    showSuccessAnimation('copy');
                },
                color: 'primary'
            },
            {
                id: 'download',
                label: '下载Markdown',
                icon: <Download />,
                shortcut: 'Ctrl+S',
                action: () => {
                    onDownload?.();
                    showSuccessAnimation('download');
                },
                color: 'success'
            },
            {
                id: 'share',
                label: '分享',
                icon: <Share />,
                action: () => onShare?.(),
                color: 'info',
                disabled: !navigator.share
            },
            {
                id: 'print',
                label: '打印',
                icon: <Print />,
                shortcut: 'Ctrl+P',
                action: () => onPrint?.(),
                color: 'secondary'
            },
            {
                id: 'fullscreen',
                label: '全屏预览',
                icon: <Fullscreen />,
                shortcut: 'F11',
                action: () => onFullscreen?.(),
                color: 'warning'
            }
        ];

        setActions(availableActions.filter(action => !action.disabled));
    }, [onCopy, onDownload, onShare, onPrint, onFullscreen]);

    const showSuccessAnimation = (actionId) => {
        setShowSuccess(prev => ({ ...prev, [actionId]: true }));
        setTimeout(() => {
            setShowSuccess(prev => ({ ...prev, [actionId]: false }));
        }, 2000);
    };

    if (!visible || !markdown) return null;

    return (
        <Fade in={visible}>
            <Card 
                sx={{ 
                    position: 'sticky',
                    top: 16,
                    zIndex: 100,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
            >
                <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AutoFixHigh color="primary" />
                            <Typography variant="h6">
                                快速操作
                            </Typography>
                            <Chip 
                                label={`${Math.round(markdown.length / 1024)}KB`} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                            />
                        </Box>
                        <IconButton size="small" onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {actions.map((action) => (
                            <Tooltip 
                                key={action.id}
                                title={
                                    <Box>
                                        <Typography variant="body2">{action.label}</Typography>
                                        {action.shortcut && (
                                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                快捷键: {action.shortcut}
                                            </Typography>
                                        )}
                                    </Box>
                                }
                                arrow
                            >
                                <Button
                                    variant="outlined"
                                    color={action.color}
                                    size="small"
                                    onClick={action.action}
                                    startIcon={
                                        showSuccess[action.id] ? 
                                        <CheckCircle color="success" /> : 
                                        action.icon
                                    }
                                    sx={{
                                        minWidth: 'auto',
                                        px: 1,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: 2
                                        }
                                    }}
                                >
                                    {showSuccess[action.id] ? '已完成' : action.label}
                                </Button>
                            </Tooltip>
                        ))}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            💡 提示：使用键盘快捷键可以更快操作
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            转换结果: {markdown.split('\n').length} 行
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Fade>
    );
};

export default QuickActions;
