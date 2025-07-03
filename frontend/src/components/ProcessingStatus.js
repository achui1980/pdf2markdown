import React from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Info,
  Warning,
} from '@mui/icons-material';

const ProcessingStatus = ({ 
  status = 'idle', // 'idle', 'uploading', 'processing', 'success', 'error'
  progress = 0,
  message = '',
  details = ''
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'uploading':
        return {
          icon: <Info color="info" />,
          color: 'info',
          label: '上传中',
          showProgress: true,
        };
      case 'processing':
        return {
          icon: <Warning color="warning" />,
          color: 'warning',
          label: '处理中',
          showProgress: true,
        };
      case 'success':
        return {
          icon: <CheckCircle color="success" />,
          color: 'success',
          label: '完成',
          showProgress: false,
        };
      case 'error':
        return {
          icon: <Error color="error" />,
          color: 'error',
          label: '错误',
          showProgress: false,
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();

  if (!config || status === 'idle') {
    return null;
  }

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid`,
        borderColor: `${config.color}.light`,
        backgroundColor: `${config.color}.light`,
        backgroundOpacity: 0.1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {config.icon}
        <Chip
          label={config.label}
          color={config.color}
          size="small"
          sx={{ ml: 1 }}
        />
        <Box sx={{ flexGrow: 1 }} />
        {config.showProgress && (
          <Typography variant="body2" color="text.secondary">
            {progress}%
          </Typography>
        )}
      </Box>
      
      {message && (
        <Typography variant="body1" sx={{ mb: 1 }}>
          {message}
        </Typography>
      )}
      
      {details && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {details}
        </Typography>
      )}
      
      {config.showProgress && (
        <LinearProgress
          variant="determinate"
          value={progress}
          color={config.color}
          sx={{ borderRadius: 1 }}
        />
      )}
    </Paper>
  );
};

export default ProcessingStatus;
