import React, { useState } from 'react';
import {
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Chip
} from '@mui/material';
import {
    Help,
    Close,
    Fullscreen,
    CloudUpload,
    Transform,
    Download,
    ContentCopy
} from '@mui/icons-material';

const HelpDialog = ({ open, onClose }) => {
    const shortcuts = [
        { key: 'Ctrl + O', action: '打开文件选择器', icon: <CloudUpload /> },
        { key: 'Ctrl + S', action: '下载Markdown文件', icon: <Download /> },
        { key: 'Ctrl + Shift + C', action: '复制Markdown内容', icon: <ContentCopy /> },
        { key: 'ESC', action: '重置/返回上一步', icon: <Transform /> },
        { key: 'F11', action: '切换全屏预览', icon: <Fullscreen /> }
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                使用帮助
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        📖 使用步骤
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" paragraph>
                            1. 拖拽PDF文件到页面任意位置或点击上传区域选择文件
                        </Typography>
                        <Typography variant="body2" paragraph>
                            2. 点击"开始转换"按钮，等待AI处理完成
                        </Typography>
                        <Typography variant="body2" paragraph>
                            3. 查看转换结果，支持PDF和Markdown分屏预览
                        </Typography>
                        <Typography variant="body2" paragraph>
                            4. 复制内容或下载Markdown文件
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        ⌨️ 键盘快捷键
                    </Typography>
                    <List dense>
                        {shortcuts.map((shortcut, index) => (
                            <ListItem key={index}>
                                <ListItemIcon>{shortcut.icon}</ListItemIcon>
                                <ListItemText 
                                    primary={shortcut.action}
                                    secondary={
                                        <Chip 
                                            label={shortcut.key} 
                                            size="small" 
                                            variant="outlined"
                                        />
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                    <Typography variant="h6" gutterBottom>
                        📋 支持格式
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label="PDF文件" color="primary" />
                        <Chip label="最大50MB" color="secondary" />
                        <Chip label="多页文档" color="info" />
                        <Chip label="文字识别" color="success" />
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

const HelpButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Fab
                color="secondary"
                size="small"
                sx={{ 
                    position: 'fixed', 
                    bottom: 80, 
                    right: 16,
                    zIndex: 1000
                }}
                onClick={() => setOpen(true)}
            >
                <Help />
            </Fab>
            <HelpDialog open={open} onClose={() => setOpen(false)} />
        </>
    );
};

export default HelpButton;
