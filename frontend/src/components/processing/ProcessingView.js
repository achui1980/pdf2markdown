import React from 'react';
import {
    Grid,
    Card,
    CardContent,
    Box,
    Typography,
    Button,
    LinearProgress
} from '@mui/material';
import {
    PictureAsPdf,
    Transform
} from '@mui/icons-material';

const ProcessingView = ({ 
    pdfFile, 
    loading, 
    processingProgress, 
    processingStatus, 
    onUpload, 
    onReset 
}) => {
    const getStatusText = () => {
        switch (processingStatus) {
            case 'uploading':
                return '正在上传文件...';
            case 'processing':
                return '正在处理PDF...';
            case 'success':
                return '转换完成！';
            case 'error':
                return '转换失败';
            default:
                return '等待开始...';
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card elevation={3}>
                    <CardContent>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <PictureAsPdf sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                已选择文件: {pdfFile?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                文件大小: {pdfFile ? (pdfFile.size / 1024 / 1024).toFixed(2) : 0} MB
                            </Typography>
                            {loading && (
                                <Box sx={{ mb: 3 }}>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={processingProgress} 
                                        sx={{ mb: 2 }} 
                                    />
                                    <Typography variant="body2">
                                        {getStatusText()}
                                        {processingProgress > 0 && ` (${processingProgress}%)`}
                                    </Typography>
                                </Box>
                            )}
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<Transform />}
                                    onClick={onUpload}
                                    disabled={loading}
                                    sx={{ minWidth: 160 }}
                                >
                                    {loading ? '转换中...' : '开始转换'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={onReset}
                                    disabled={loading}
                                >
                                    重新选择
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default ProcessingView;
