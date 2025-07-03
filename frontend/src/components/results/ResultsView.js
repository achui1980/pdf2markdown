import React, { useState } from 'react';
import {
    Box,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Close
} from '@mui/icons-material';
import ViewToolbar from './ViewToolbar';
import PDFViewer from './PDFViewer';
import MarkdownViewer from './MarkdownViewer';

const ResultsView = ({ 
    markdown, 
    pdfUrl, 
    pdfFile,
    numPages, 
    onDocumentLoadSuccess, 
    onDocumentLoadError,
    onCopyMarkdown,
    onDownloadMarkdown,
    onReset
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [viewMode, setViewMode] = useState(isMobile ? 'markdown' : 'split');
    const [previewDialog, setPreviewDialog] = useState(false);

    return (
        <Box>
            <ViewToolbar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onCopy={onCopyMarkdown}
                onDownload={onDownloadMarkdown}
                onReset={onReset}
            />

            <Grid container spacing={3}>
                {(viewMode === 'split' || viewMode === 'pdf') && (
                    <Grid item xs={12} md={viewMode === 'split' ? 6 : 12}>
                        <PDFViewer
                            pdfUrl={pdfUrl}
                            numPages={numPages}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            onFullscreen={() => setPreviewDialog(true)}
                            width={viewMode === 'split' ? 300 : 600}
                        />
                    </Grid>
                )}
                
                {(viewMode === 'split' || viewMode === 'markdown') && (
                    <Grid item xs={12} md={viewMode === 'split' ? 6 : 12}>
                        <MarkdownViewer markdown={markdown} />
                    </Grid>
                )}
            </Grid>

            {/* 全屏PDF预览对话框 */}
            <Dialog 
                open={previewDialog} 
                onClose={() => setPreviewDialog(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    PDF全屏预览
                    <IconButton
                        onClick={() => setPreviewDialog(false)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ height: '80vh', overflow: 'auto' }}>
                    <PDFViewer
                        pdfUrl={pdfUrl}
                        numPages={numPages}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        width={800}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default ResultsView;
