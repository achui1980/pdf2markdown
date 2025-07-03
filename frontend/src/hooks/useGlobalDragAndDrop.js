import { useState, useEffect } from 'react';

export const useGlobalDragAndDrop = (onFileDrop) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const [dragCounter, setDragCounter] = useState(0);

    useEffect(() => {
        const handleDragEnter = (e) => {
            e.preventDefault();
            setDragCounter(prev => prev + 1);
            if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
                setIsDragActive(true);
            }
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            setDragCounter(prev => prev - 1);
            if (dragCounter <= 1) {
                setIsDragActive(false);
            }
        };

        const handleDragOver = (e) => {
            e.preventDefault();
        };

        const handleDrop = (e) => {
            e.preventDefault();
            setIsDragActive(false);
            setDragCounter(0);
            
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                onFileDrop(e.dataTransfer.files[0]);
            }
        };

        // 添加全局拖拽监听
        document.addEventListener('dragenter', handleDragEnter);
        document.addEventListener('dragleave', handleDragLeave);
        document.addEventListener('dragover', handleDragOver);
        document.addEventListener('drop', handleDrop);

        return () => {
            document.removeEventListener('dragenter', handleDragEnter);
            document.removeEventListener('dragleave', handleDragLeave);
            document.removeEventListener('dragover', handleDragOver);
            document.removeEventListener('drop', handleDrop);
        };
    }, [dragCounter, onFileDrop]);

    return { isDragActive };
};
