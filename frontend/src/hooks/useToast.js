import { useState, useCallback, useRef } from 'react';

// 优化的提示管理Hook
export const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const toastIdRef = useRef(0);

    const showToast = useCallback((message, severity = 'info', options = {}) => {
        const id = ++toastIdRef.current;
        const toast = {
            id,
            message,
            severity,
            open: true,
            autoHideDuration: options.autoHideDuration || (severity === 'error' ? 6000 : 4000),
            action: options.action
        };

        setToasts(prev => [...prev, toast]);

        // 自动移除
        if (toast.autoHideDuration) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, toast.autoHideDuration);
        }

        return id;
    }, []);

    const closeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const closeAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    // 便捷方法
    const showSuccess = useCallback((message, options) => 
        showToast(message, 'success', options), [showToast]);
    
    const showError = useCallback((message, options) => 
        showToast(message, 'error', options), [showToast]);
    
    const showWarning = useCallback((message, options) => 
        showToast(message, 'warning', options), [showToast]);
    
    const showInfo = useCallback((message, options) => 
        showToast(message, 'info', options), [showToast]);

    return {
        toasts,
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        closeToast,
        closeAllToasts
    };
};
