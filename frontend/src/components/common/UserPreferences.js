import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Slider,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Collapse,
    Divider,
    Switch,
    Select,
    MenuItem,
    InputLabel
} from '@mui/material';
import {
    Settings,
    ExpandMore,
    ExpandLess,
    Restore
} from '@mui/icons-material';

// 用户偏好设置组件
const UserPreferences = ({ 
    onPreferencesChange,
    disabled = false 
}) => {
    const [expanded, setExpanded] = useState(false);
    const [preferences, setPreferences] = useState(() => {
        // 从localStorage加载设置
        const saved = localStorage.getItem('pdf2markdown_preferences');
        return saved ? JSON.parse(saved) : {
            autoPreview: true,
            defaultViewMode: 'split',
            fontSize: 14,
            theme: 'auto',
            autoDownload: false,
            compressionLevel: 'medium',
            language: 'zh-CN',
            notifications: true,
            autoSave: true
        };
    });

    const timeoutRef = useRef(null);

    // 保存设置到localStorage
    useEffect(() => {
        localStorage.setItem('pdf2markdown_preferences', JSON.stringify(preferences));
        onPreferencesChange?.(preferences);
    }, [preferences, onPreferencesChange]);

    const handlePreferenceChange = (key, value) => {
        setPreferences(prev => ({
            ...prev,
            [key]: value
        }));

        // 防抖处理，避免频繁触发
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            onPreferencesChange?.(preferences);
        }, 300);
    };

    const resetToDefaults = () => {
        const defaults = {
            autoPreview: true,
            defaultViewMode: 'split',
            fontSize: 14,
            theme: 'auto',
            autoDownload: false,
            compressionLevel: 'medium',
            language: 'zh-CN',
            notifications: true,
            autoSave: true
        };
        setPreferences(defaults);
    };

    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Settings /> 偏好设置
                    </Typography>
                    <Button
                        size="small"
                        endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
                        onClick={() => setExpanded(!expanded)}
                        disabled={disabled}
                    >
                        {expanded ? '收起' : '展开'}
                    </Button>
                </Box>

                <Collapse in={expanded}>
                    <Box sx={{ pt: 2 }}>
                        {/* 视图设置 */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                📱 视图设置
                            </Typography>
                            
                            <FormControl component="fieldset" sx={{ mb: 2 }}>
                                <FormLabel component="legend">默认视图模式</FormLabel>
                                <RadioGroup
                                    row
                                    value={preferences.defaultViewMode}
                                    onChange={(e) => handlePreferenceChange('defaultViewMode', e.target.value)}
                                >
                                    <FormControlLabel value="split" control={<Radio />} label="分屏" />
                                    <FormControlLabel value="markdown" control={<Radio />} label="Markdown" />
                                    <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
                                </RadioGroup>
                            </FormControl>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" gutterBottom>
                                    字体大小: {preferences.fontSize}px
                                </Typography>
                                <Slider
                                    value={preferences.fontSize}
                                    onChange={(e, value) => handlePreferenceChange('fontSize', value)}
                                    min={12}
                                    max={20}
                                    step={1}
                                    marks
                                    valueLabelDisplay="auto"
                                />
                            </Box>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>主题</InputLabel>
                                <Select
                                    value={preferences.theme}
                                    onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                                    label="主题"
                                >
                                    <MenuItem value="auto">跟随系统</MenuItem>
                                    <MenuItem value="light">浅色</MenuItem>
                                    <MenuItem value="dark">深色</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* 功能设置 */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                ⚙️ 功能设置
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2">自动预览</Typography>
                                    <Switch
                                        checked={preferences.autoPreview}
                                        onChange={(e) => handlePreferenceChange('autoPreview', e.target.checked)}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2">转换完成后自动下载</Typography>
                                    <Switch
                                        checked={preferences.autoDownload}
                                        onChange={(e) => handlePreferenceChange('autoDownload', e.target.checked)}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2">显示通知</Typography>
                                    <Switch
                                        checked={preferences.notifications}
                                        onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2">自动保存设置</Typography>
                                    <Switch
                                        checked={preferences.autoSave}
                                        onChange={(e) => handlePreferenceChange('autoSave', e.target.checked)}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* 高级设置 */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                🔧 高级设置
                            </Typography>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>压缩级别</InputLabel>
                                <Select
                                    value={preferences.compressionLevel}
                                    onChange={(e) => handlePreferenceChange('compressionLevel', e.target.value)}
                                    label="压缩级别"
                                >
                                    <MenuItem value="low">低压缩 (更快)</MenuItem>
                                    <MenuItem value="medium">中等压缩 (推荐)</MenuItem>
                                    <MenuItem value="high">高压缩 (更小文件)</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>语言</InputLabel>
                                <Select
                                    value={preferences.language}
                                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                                    label="语言"
                                >
                                    <MenuItem value="zh-CN">简体中文</MenuItem>
                                    <MenuItem value="en-US">English</MenuItem>
                                    <MenuItem value="ja-JP">日本語</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                startIcon={<Restore />}
                                onClick={resetToDefaults}
                                size="small"
                                color="secondary"
                            >
                                恢复默认设置
                            </Button>
                        </Box>
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    );
};

export default UserPreferences;
