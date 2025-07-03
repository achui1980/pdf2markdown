import React from 'react';
import {
    Snackbar,
    Alert,
    Slide,
    Stack
} from '@mui/material';

// 优化的提示组件，支持多种类型和动画
const Toast = ({ 
    open, 
    message, 
    severity = 'info', 
    autoHideDuration = 4000, 
    onClose,
    action 
}) => {
    const SlideTransition = (props) => {
        return <Slide {...props} direction="down" />;
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            TransitionComponent={SlideTransition}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{ zIndex: 9999 }}
        >
            <Alert 
                onClose={onClose} 
                severity={severity} 
                variant="filled"
                action={action}
                sx={{
                    minWidth: '300px',
                    '& .MuiAlert-message': {
                        wordBreak: 'break-word'
                    }
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

// 多重提示管理器
export const ToastProvider = ({ children, toasts, onCloseToast }) => {
    return (
        <>
            {children}
            <Stack spacing={1} sx={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        open={toast.open}
                        message={toast.message}
                        severity={toast.severity}
                        autoHideDuration={toast.autoHideDuration}
                        onClose={() => onCloseToast(toast.id)}
                        action={toast.action}
                    />
                ))}
            </Stack>
        </>
    );
};

export default Toast;
