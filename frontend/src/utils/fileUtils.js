// 文件下载工具
export const downloadMarkdown = (markdown, filename) => {
    const element = document.createElement('a');
    const file = new Blob([markdown], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${filename.replace('.pdf', '')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

// 复制到剪贴板
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
};

// 文件验证
export const validatePDFFile = (file) => {
    if (!file) {
        throw new Error('请选择文件');
    }
    
    if (file.type !== 'application/pdf') {
        throw new Error('请选择有效的PDF文件');
    }
    
    // 50MB limit
    if (file.size > 50 * 1024 * 1024) {
        throw new Error('文件大小不能超过50MB');
    }
    
    return true;
};
