import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    LinearProgress,
    Typography,
    Collapse,
    IconButton,
    Chip,
    Button
} from '@mui/material';
import {
    ExpandMore,
    ExpandLess,
    Cancel,
    Refresh
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ProcessingCard = styled(Card)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`,
    border: `1px solid ${theme.palette.primary.light}`,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[8]
    }
}));

const AnimatedProgress = styled(LinearProgress)(({ theme }) => ({
    height: 8,
    borderRadius: 4,
    '& .MuiLinearProgress-bar': {
        borderRadius: 4,
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
    }
}));

const ProcessingStatusCard = ({ 
    loading, 
    processingProgress, 
    processingStatus,
    fileName,
    fileSize,
    onCancel,
    onRetry,
    error,
    estimatedTime
}) => {
    const [expanded, setExpanded] = useState(true);
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (loading && processingStatus !== 'error') {
            intervalRef.current = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (!loading) {
                setElapsedTime(0);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [loading, processingStatus]);

    const getStatusConfig = () => {
        switch (processingStatus) {
            case 'uploading':
                return {
                    text: '正在上传文件...',
                    color: 'info',
                    icon: '📤'
                };
            case 'processing':
                return {
                    text: 'AI正在分析PDF内容...',
                    color: 'primary',
                    icon: '🤖'
                };
            case 'success':
                return {
                    text: '转换完成！',
                    color: 'success',
                    icon: '✅'
                };
            case 'error':
                return {
                    text: '转换失败',
                    color: 'error',
                    icon: '❌'
                };
            default:
                return {
                    text: '准备开始...',
                    color: 'default',
                    icon: '⏳'
                };
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const statusConfig = getStatusConfig();

    if (!loading && processingStatus !== 'error' && processingStatus !== 'success') {
        return null;
    }

    return (
        <ProcessingCard elevation={4}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6">
                            {statusConfig.icon} {statusConfig.text}
                        </Typography>
                        <Chip 
                            label={statusConfig.text}
                            color={statusConfig.color}
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {loading && (
                            <Typography variant="body2" color="text.secondary">
                                {formatTime(elapsedTime)}
                            </Typography>
                        )}
                        <IconButton 
                            size="small" 
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </Box>
                </Box>

                {loading && processingStatus !== 'error' && (
                    <Box sx={{ mb: 2 }}>
                        <AnimatedProgress 
                            variant="determinate" 
                            value={processingProgress} 
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                进度: {processingProgress}%
                            </Typography>
                            {estimatedTime && (
                                <Typography variant="body2" color="text.secondary">
                                    预计剩余: {formatTime(estimatedTime)}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                )}

                <Collapse in={expanded}>
                    <Box sx={{ pt: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            📁 文件名: {fileName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            📊 文件大小: {fileSize ? (fileSize / 1024 / 1024).toFixed(2) : 0} MB
                        </Typography>
                        
                        {error && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                                <Typography variant="body2" color="error.dark">
                                    错误详情: {error}
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            {loading && (
                                <Button
                                    size="small"
                                    startIcon={<Cancel />}
                                    onClick={onCancel}
                                    color="error"
                                >
                                    取消
                                </Button>
                            )}
                            {processingStatus === 'error' && (
                                <Button
                                    size="small"
                                    startIcon={<Refresh />}
                                    onClick={onRetry}
                                    color="primary"
                                >
                                    重试
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Collapse>
            </CardContent>
        </ProcessingCard>
    );
};

export default ProcessingStatusCard;
