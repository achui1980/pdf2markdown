import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    IconButton,
    Chip,
    Button
} from '@mui/material';
import {
    PictureAsPdf,
    Close,
    FileUpload,
    Info
} from '@mui/icons-material';
import { Document, Page } from 'react-pdf';

const FilePreviewCard = ({ 
    file, 
    onRemove, 
    onReplace,
    showPreview = true 
}) => {
    const [numPages, setNumPages] = useState(null);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <Card elevation={2} sx={{ mb: 2 }}>
            <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {/* PDF预览缩略图 */}
                    {showPreview && (
                        <Box 
                            sx={{ 
                                width: 80, 
                                height: 100, 
                                border: '1px solid #e0e0e0',
                                borderRadius: 1,
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#fafafa'
                            }}
                        >
                            <Document
                                file={file}
                                onLoadSuccess={onDocumentLoadSuccess}
                                loading={<PictureAsPdf color="action" />}
                                error={<PictureAsPdf color="action" />}
                            >
                                <Page 
                                    pageNumber={1} 
                                    width={78}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                            </Document>
                        </Box>
                    )}
                    
                    {/* 文件信息 */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PictureAsPdf sx={{ mr: 1, color: 'error.main' }} />
                            <Typography variant="subtitle1" noWrap sx={{ flex: 1 }}>
                                {file.name}
                            </Typography>
                            <IconButton size="small" onClick={onRemove}>
                                <Close />
                            </IconButton>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                            <Chip 
                                label={formatFileSize(file.size)} 
                                size="small" 
                                variant="outlined"
                                icon={<Info />}
                            />
                            {numPages && (
                                <Chip 
                                    label={`${numPages} 页`} 
                                    size="small" 
                                    variant="outlined"
                                    color="primary"
                                />
                            )}
                            <Chip 
                                label="PDF" 
                                size="small" 
                                color="error"
                                variant="filled"
                            />
                        </Box>
                        
                        <Button
                            size="small"
                            startIcon={<FileUpload />}
                            onClick={onReplace}
                            variant="outlined"
                        >
                            替换文件
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default FilePreviewCard;
