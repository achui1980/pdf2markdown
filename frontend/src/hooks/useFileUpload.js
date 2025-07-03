import { useState } from 'react';
import apiClient from '../config/axios';

export const useFileUpload = () => {
    const [loading, setLoading] = useState(false);
    const [processingStatus, setProcessingStatus] = useState('idle');
    const [processingProgress, setProcessingProgress] = useState(0);

    const uploadFile = async (pdfFile) => {
        if (!pdfFile) {
            throw new Error('请先选择PDF文件');
        }

        setLoading(true);
        setProcessingStatus('uploading');
        setProcessingProgress(10);
        
        const formData = new FormData();
        formData.append('pdf', pdfFile);

        try {
            // 模拟上传进度
            const uploadInterval = setInterval(() => {
                setProcessingProgress(prev => {
                    if (prev < 30) return prev + 5;
                    return prev;
                });
            }, 200);

            const requestTimeout = parseInt(process.env.REACT_APP_REQUEST_TIMEOUT) || 600000;
            const response = await apiClient.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: requestTimeout, // 使用环境变量配置的超时时间
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 30) / progressEvent.total);
                    setProcessingProgress(30 + progress);
                }
            });

            clearInterval(uploadInterval);
            setProcessingStatus('processing');
            setProcessingProgress(70);

            // 模拟处理进度
            const processingInterval = setInterval(() => {
                setProcessingProgress(prev => {
                    if (prev < 95) return prev + 5;
                    return prev;
                });
            }, 300);

            return new Promise((resolve) => {
                setTimeout(() => {
                    clearInterval(processingInterval);
                    setProcessingStatus('success');
                    setProcessingProgress(100);
                    resolve(response.data);
                }, 1500);
            });

        } catch (error) {
            setProcessingStatus('error');
            
            let errorMessage = '转换失败，请稍后重试';
            
            if (error.response?.data) {
                const { error: serverError, code } = error.response.data;
                
                switch (code) {
                    case 'NO_FILE':
                        errorMessage = '请选择要上传的文件';
                        break;
                    case 'FILE_TOO_LARGE':
                        errorMessage = '文件大小超过50MB限制';
                        break;
                    case 'INVALID_FILE_TYPE':
                        errorMessage = '只支持PDF文件格式';
                        break;
                    case 'CONFIG_ERROR':
                        errorMessage = '服务配置错误，请联系管理员';
                        break;
                    case 'CONVERSION_ERROR':
                        errorMessage = 'PDF转换失败，请检查文件是否损坏';
                        break;
                    default:
                        errorMessage = serverError || errorMessage;
                }
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = '请求超时，文件可能较大或网络较慢，请稍后重试';
            } else if (error.code === 'NETWORK_ERROR') {
                errorMessage = '网络连接失败，请检查网络连接';
            } else if (error.code === 'ECONNREFUSED') {
                errorMessage = '无法连接到服务器，请确保后端服务正在运行';
            } else if (error.message?.includes('timeout')) {
                errorMessage = '请求超时，文件可能较大或处理时间较长，请稍后重试';
            }
            
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setLoading(false);
        setProcessingStatus('idle');
        setProcessingProgress(0);
    };

    return {
        loading,
        processingStatus,
        processingProgress,
        uploadFile,
        reset
    };
};
