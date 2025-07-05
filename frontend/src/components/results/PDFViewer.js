import React from 'react';
import {
    Card,
    CardContent,
    Box,
    Typography,
    IconButton,
    Tooltip,
    Divider
} from '@mui/material';
import {
    PictureAsPdf,
    Fullscreen
} from '@mui/icons-material';
import { Document, Page } from 'react-pdf';

const PDFViewer = ({ 
    pdfUrl, 
    pageNumber,
    numPages, 
    onLoadSuccess, 
    onLoadError,
    onFullscreen,
    width = 300
}) => {
    return (
        <Card elevation={3} sx={{ height: '70vh' }}>
            <CardContent sx={{ height: '100%', overflow: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PictureAsPdf sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">PDF预览</Typography>
                    {onFullscreen && (
                        <Tooltip title="全屏查看">
                            <IconButton onClick={onFullscreen}>
                                <Fullscreen />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
                <Divider sx={{ mb: 2 }} />
                {pdfUrl && (
                    <Document 
                        file={pdfUrl} 
                        onLoadSuccess={onLoadSuccess}
                        onLoadError={onLoadError}
                        loading={<Typography>正在加载PDF...</Typography>}
                        error={<Typography color="error">PDF加载失败</Typography>}
                    >
                        <Page 
                            pageNumber={pageNumber} 
                            width={width}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </Document>
                )}
            </CardContent>
        </Card>
    );
};

export default PDFViewer;
