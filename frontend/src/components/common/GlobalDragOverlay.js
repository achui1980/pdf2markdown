import React from 'react';
import {
    Box,
    Typography,
    Fade
} from '@mui/material';
import {
    CloudUpload
} from '@mui/icons-material';

const GlobalDragOverlay = ({ isActive }) => {
    return (
        <Fade in={isActive}>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                }}
            >
                <Box
                    sx={{
                        textAlign: 'center',
                        p: 4,
                        backgroundColor: 'white',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        border: '2px dashed #2196f3',
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                >
                    <CloudUpload 
                        sx={{ 
                            fontSize: 80, 
                            color: 'primary.main', 
                            mb: 2,
                            animation: 'bounce 1s ease-in-out infinite'
                        }} 
                    />
                    <Typography variant="h5" color="primary" gutterBottom>
                        释放以上传PDF文件
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        支持PDF格式，最大50MB
                    </Typography>
                </Box>
            </Box>
        </Fade>
    );
};

export default GlobalDragOverlay;
