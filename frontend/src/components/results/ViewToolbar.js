import React from 'react';
import {
    Paper,
    Box,
    Button
} from '@mui/material';
import {
    PictureAsPdf,
    Code,
    ContentCopy,
    Download
} from '@mui/icons-material';

const ViewToolbar = ({ 
    viewMode, 
    onViewModeChange, 
    onCopy, 
    onDownload, 
    onReset 
}) => {
    return (
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant={viewMode === 'split' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => onViewModeChange('split')}
                    >
                        分屏预览
                    </Button>
                    <Button
                        variant={viewMode === 'pdf' ? 'contained' : 'outlined'}
                        size="small"
                        startIcon={<PictureAsPdf />}
                        onClick={() => onViewModeChange('pdf')}
                    >
                        PDF预览
                    </Button>
                    <Button
                        variant={viewMode === 'markdown' ? 'contained' : 'outlined'}
                        size="small"
                        startIcon={<Code />}
                        onClick={() => onViewModeChange('markdown')}
                    >
                        Markdown预览
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ContentCopy />}
                        onClick={onCopy}
                        size="small"
                    >
                        复制
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Download />}
                        onClick={onDownload}
                        color="success"
                    >
                        下载Markdown
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={onReset}
                    >
                        转换新文件
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default ViewToolbar;
