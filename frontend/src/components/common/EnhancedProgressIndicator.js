import React from 'react';
import {
    Box,
    Typography,
    LinearProgress,
    Chip,
    CircularProgress
} from '@mui/material';
import {
    CheckCircle,
    Error,
    Upload,
    AutoFixHigh
} from '@mui/icons-material';

const EnhancedProgressIndicator = ({ 
    status, 
    progress, 
    message,
    showEstimatedTime = false,
    estimatedTimeRemaining 
}) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'uploading':
                return {
                    icon: <Upload />,
                    color: 'info',
                    bgColor: '#e3f2fd'
                };
            case 'processing':
                return {
                    icon: <AutoFixHigh />,
                    color: 'warning',
                    bgColor: '#fff3e0'
                };
            case 'success':
                return {
                    icon: <CheckCircle />,
                    color: 'success',
                    bgColor: '#e8f5e8'
                };
            case 'error':
                return {
                    icon: <Error />,
                    color: 'error',
                    bgColor: '#ffebee'
                };
            default:
                return {
                    icon: <CircularProgress size={20} />,
                    color: 'default',
                    bgColor: '#f5f5f5'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <Box 
            sx={{ 
                p: 2, 
                borderRadius: 2, 
                backgroundColor: config.bgColor,
                border: `1px solid ${config.bgColor}`,
                transition: 'all 0.3s ease'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip
                    icon={config.icon}
                    label={message}
                    color={config.color}
                    variant="outlined"
                    size="small"
                />
                {showEstimatedTime && estimatedTimeRemaining && (
                    <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                        预计剩余: {estimatedTimeRemaining}
                    </Typography>
                )}
            </Box>
            
            {progress !== undefined && (
                <Box sx={{ mt: 1 }}>
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                transition: 'transform 0.4s ease'
                            }
                        }} 
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                            {progress.toFixed(0)}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {status === 'uploading' ? '上传中' : status === 'processing' ? '处理中' : '完成'}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default EnhancedProgressIndicator;
