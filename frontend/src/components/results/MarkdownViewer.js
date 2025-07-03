import React from 'react';
import {
    Card,
    CardContent,
    Box,
    Typography,
    Chip,
    Divider
} from '@mui/material';
import {
    Code
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';

const MarkdownViewer = ({ markdown }) => {
    return (
        <Card elevation={3} sx={{ height: '70vh' }}>
            <CardContent sx={{ height: '100%', overflow: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Code sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Markdown预览</Typography>
                    <Chip 
                        label={`${markdown.length} 字符`} 
                        size="small" 
                        sx={{ ml: 'auto' }} 
                    />
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ textAlign: 'left' }}>
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                </Box>
            </CardContent>
        </Card>
    );
};

export default MarkdownViewer;
