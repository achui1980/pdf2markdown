import React, { useRef } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Paper
} from '@mui/material';
import {
    CloudUpload,
    PictureAsPdf
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
    display: 'none',
});

const UploadBox = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'isDragOver',
})(({ theme, isDragOver }) => ({
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    border: `2px dashed ${isDragOver ? theme.palette.primary.main : theme.palette.grey[300]}`,
    backgroundColor: isDragOver ? theme.palette.primary.light + '10' : 'transparent',
    transition: 'all 0.3s ease',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light + '05',
    },
}));

const FileUploader = ({ 
    isDragOver, 
    onDragOver, 
    onDragLeave, 
    onDrop, 
    onFileSelect 
}) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        onFileSelect(file);
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card elevation={3}>
                    <CardContent>
                        <UploadBox
                            isDragOver={isDragOver}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                拖拽PDF文件到此处或点击选择
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                支持PDF格式，最大文件大小50MB
                            </Typography>
                            <Input
                                ref={fileInputRef}
                                accept="application/pdf"
                                type="file"
                                onChange={handleFileChange}
                            />
                            <Button variant="outlined" startIcon={<PictureAsPdf />}>
                                选择PDF文件
                            </Button>
                        </UploadBox>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default FileUploader;
