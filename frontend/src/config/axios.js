import axios from 'axios';

// 从环境变量获取配置
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
const REQUEST_TIMEOUT = parseInt(process.env.REACT_APP_REQUEST_TIMEOUT) || 600000; // 默认10分钟

// 创建axios实例
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
apiClient.interceptors.request.use(
    (config) => {
        // 在发送请求之前可以做一些处理
        console.log('发送请求:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('请求错误:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
apiClient.interceptors.response.use(
    (response) => {
        // 对响应数据做一些处理
        console.log('收到响应:', response.status, response.config.url);
        return response;
    },
    (error) => {
        // 对响应错误做一些处理
        console.error('响应错误:', error.response?.status, error.message);
        
        if (error.code === 'ECONNABORTED') {
            console.error('请求超时');
        } else if (error.response?.status === 404) {
            console.error('API端点不存在');
        } else if (error.response?.status >= 500) {
            console.error('服务器内部错误');
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;
