import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import { 
  PictureAsPdf, 
  Description, 
  FileDownload,
  Visibility,
  Close
} from '@mui/icons-material';

const FileCard = ({ 
  file, 
  onRemove, 
  onPreview, 
  onDownload, 
  type = 'pdf',
  size,
  processed = false 
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getIcon = () => {
    return type === 'pdf' ? <PictureAsPdf /> : <Description />;
  };

  const getColor = () => {
    return type === 'pdf' ? 'error' : 'success';
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 2,
        border: processed ? '2px solid #4caf50' : '1px solid #e0e0e0',
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ mr: 2, color: getColor() + '.main' }}>
          {getIcon()}
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {file.name || '未命名文件'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {size ? formatFileSize(size) : '大小未知'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {processed && (
            <Chip
              label="已处理"
              color="success"
              size="small"
              sx={{ mr: 1 }}
            />
          )}
          {onPreview && (
            <Tooltip title="预览">
              <IconButton size="small" onClick={onPreview}>
                <Visibility />
              </IconButton>
            </Tooltip>
          )}
          {onDownload && (
            <Tooltip title="下载">
              <IconButton size="small" onClick={onDownload} color="primary">
                <FileDownload />
              </IconButton>
            </Tooltip>
          )}
          {onRemove && (
            <Tooltip title="移除">
              <IconButton size="small" onClick={onRemove} color="error">
                <Close />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default FileCard;
