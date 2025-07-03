import { useEffect } from 'react';

export const useKeyboardShortcuts = (handlers) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Ctrl/Cmd + O: 打开文件选择器
            if ((event.ctrlKey || event.metaKey) && event.key === 'o') {
                event.preventDefault();
                handlers.openFile?.();
            }
            
            // Ctrl/Cmd + S: 下载Markdown
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                handlers.saveFile?.();
            }
            
            // Ctrl/Cmd + C: 复制Markdown
            if ((event.ctrlKey || event.metaKey) && event.key === 'c' && event.shiftKey) {
                event.preventDefault();
                handlers.copyContent?.();
            }
            
            // Escape: 重置/返回
            if (event.key === 'Escape') {
                handlers.reset?.();
            }
            
            // F11: 全屏预览
            if (event.key === 'F11') {
                event.preventDefault();
                handlers.toggleFullscreen?.();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handlers]);
};
