require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { zerox } = require('zerox');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const winston = require('winston');

// 日志配置
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'pdf-to-markdown' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ],
});

const app = express();
const port = process.env.PORT || 3001;

// 设置服务器超时时间 - 支持长时间处理
app.use((req, res, next) => {
    // 为上传和处理请求设置10分钟超时
    if (req.path.includes('/api/upload')) {
        req.setTimeout(10 * 60 * 1000); // 10分钟
        res.setTimeout(10 * 60 * 1000); // 10分钟
    }
    next();
});

// 增加请求体大小限制
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// 安全中间件
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 速率限制
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 限制每个IP每15分钟最多100个请求
    message: '请求过于频繁，请稍后再试',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// 上传速率限制（更严格）
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 10, // 限制每个IP每15分钟最多10次上传
    message: '上传过于频繁，请稍后再试',
});

// CORS配置 - 支持WSL访问
const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',') : 
    ['http://localhost:3000'];

// 检查是否配置为信任所有来源
const trustAllOrigins = allowedOrigins.includes('*');
const corsStrictMode = process.env.CORS_STRICT_MODE === 'true';

// 为WSL添加额外的允许源
const corsOptions = {
    origin: function (origin, callback) {
        // 如果配置为信任所有来源且非严格模式
        if (trustAllOrigins && !corsStrictMode) {
            logger.info(`CORS允许所有访问: ${origin || '无origin'}`);
            return callback(null, true);
        }
        
        // 基础允许的源
        const baseOrigins = allowedOrigins;
        
        // WSL和本地网络支持
        const additionalPatterns = [
            /^http:\/\/localhost:300[01]$/,
            /^http:\/\/127\.0\.0\.1:300[01]$/,
            /^http:\/\/.*\.local:300[01]$/,
            // 本地网络IP范围
            /^http:\/\/192\.168\.\d+\.\d+:300[01]$/,
            /^http:\/\/172\.1[6-9]\.\d+\.\d+:300[01]$/,
            /^http:\/\/172\.2[0-9]\.\d+\.\d+:300[01]$/,
            /^http:\/\/172\.3[0-1]\.\d+\.\d+:300[01]$/,
            /^http:\/\/10\.\d+\.\d+\.\d+:300[01]$/,
        ];
        
        // 开发环境允许无origin的请求
        if (!origin && process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }
        
        // 检查基础源
        if (baseOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        // 检查模式匹配
        const isPatternMatch = additionalPatterns.some(pattern => 
            pattern.test(origin)
        );
        
        if (isPatternMatch) {
            logger.info(`CORS允许访问: ${origin}`);
            callback(null, true);
        } else {
            logger.warn(`CORS阻止访问: ${origin}`);
            callback(new Error('不允许的CORS访问'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// 创建必要的目录
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const outputDir = process.env.OUTPUT_DIR || 'output';

[uploadDir, outputDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        logger.info(`Created directory: ${dir}`);
    }
});

// 静态文件服务 - 修复路径解析问题
const staticPath = uploadDir.startsWith('/') ? uploadDir.slice(1) : uploadDir;
app.use(`/${staticPath}`, express.static(path.join(__dirname, uploadDir)));

// 文件过滤器
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('只支持PDF文件'), false);
    }
};

// 设置文件存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // 生成唯一文件名，避免冲突
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024, // 50MB
        files: 1
    },
    fileFilter: fileFilter
});

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// PDF上传和转换端点
app.post('/api/upload', uploadLimiter, upload.single('pdf'), async (req, res) => {
    const startTime = Date.now();
    
    try {
        if (!req.file) {
            logger.warn('Upload attempt without file');
            return res.status(400).json({ 
                error: '没有文件上传',
                code: 'NO_FILE'
            });
        }

        // 验证API密钥
        if (!process.env.OPENAI_API_KEY) {
            logger.error('OpenAI API key not configured');
            return res.status(500).json({ 
                error: '服务配置错误',
                code: 'CONFIG_ERROR'
            });
        }

        logger.info(`Processing file: ${req.file.filename}, size: ${req.file.size} bytes`);
        
        // 配置zerox选项，增加重试和超时设置
        const requestTimeout = parseInt(process.env.REQUEST_TIMEOUT) || 120000;
        const maxRetries = parseInt(process.env.MAX_RETRIES) || 3;
        const retryDelay = parseInt(process.env.RETRY_DELAY) || 2000;
        
        const zeroxOptions = {
            filePath: req.file.path,
            credentials: {
                apiKey: process.env.OPENAI_API_KEY,
                outputDir: `./${outputDir}`,
            },
            // 增加网络配置
            openaiConfig: {
                baseURL: process.env.OPENAI_API_BASE,
                timeout: requestTimeout,
                maxRetries: maxRetries,
            }
        };

        // 如果有代理配置，添加到选项中
        if (process.env.HTTPS_PROXY) {
            logger.info(`Using proxy: ${process.env.HTTPS_PROXY}`);
        }

        logger.info(`Starting PDF conversion with zerox...`);
        logger.info(`Network settings: timeout=${requestTimeout}ms, retries=${maxRetries}, delay=${retryDelay}ms`);
        
        const result = await retryWithBackoff(async () => {
            return await zerox(zeroxOptions);
        }, maxRetries, retryDelay);

        // 处理转换结果
        let finalMarkdown = '';
        let totalPages = 0;
        
        if (result && result.pages && Array.isArray(result.pages)) {
            for (const page of result.pages) {
                if (page.content) {
                    finalMarkdown += page.content + '\n\n';
                    totalPages++;
                }
            }
        }

        const processingTime = Date.now() - startTime;
        
        logger.info(`Conversion completed: ${req.file.filename}, pages: ${totalPages}, time: ${processingTime}ms`);

        res.json({ 
            markdown: finalMarkdown,
            pdfUrl: `/${staticPath}/${req.file.filename}`,
            metadata: {
                pages: totalPages,
                fileSize: req.file.size,
                processingTime: processingTime,
                filename: req.file.originalname
            }
        });

        // 异步清理旧文件
        setTimeout(() => {
            cleanupOldFiles();
        }, 1000);

    } catch (error) {
        const processingTime = Date.now() - startTime;
        
        // 进行网络诊断
        await diagnoseNetworkIssue(error);
        
        logger.error('PDF conversion error', {
            error: error.message,
            stack: error.stack,
            file: req.file?.filename,
            processingTime: processingTime,
            errorCode: error.code,
            errorType: error.constructor.name
        });

        // 删除上传的文件（如果转换失败）
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
                logger.info(`Cleaned up failed upload: ${req.file.filename}`);
            } catch (cleanupError) {
                logger.error(`Failed to cleanup file: ${cleanupError.message}`);
            }
        }

        // 根据错误类型返回更具体的错误信息
        let errorResponse = { 
            error: 'PDF转换失败',
            code: 'CONVERSION_ERROR'
        };

        if (error.message.includes('socket hang up') || error.message.includes('ECONNRESET')) {
            errorResponse = {
                error: '网络连接中断，请检查网络或稍后重试',
                code: 'NETWORK_ERROR',
                details: '连接在处理过程中被意外断开'
            };
        } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
            errorResponse = {
                error: '请求超时，文件可能过大或网络较慢',
                code: 'TIMEOUT_ERROR',
                details: '处理时间超过了允许的限制'
            };
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
            errorResponse = {
                error: 'API服务无法访问，请检查网络配置',
                code: 'DNS_ERROR',
                details: 'DNS解析失败或服务器地址错误'
            };
        } else if (error.response?.status === 401) {
            errorResponse = {
                error: 'API密钥验证失败',
                code: 'AUTH_ERROR',
                details: '请检查OpenAI API密钥是否正确'
            };
        } else if (error.response?.status === 429) {
            errorResponse = {
                error: 'API请求频率超限，请稍后重试',
                code: 'RATE_LIMIT_ERROR',
                details: '已达到API调用频率限制'
            };
        }

        if (process.env.NODE_ENV === 'development') {
            errorResponse.debugInfo = {
                originalError: error.message,
                errorCode: error.code,
                stack: error.stack?.split('\n').slice(0, 5) // 只返回前5行堆栈
            };
        }

        res.status(500).json(errorResponse);
    }
});

// 清理旧文件的函数
function cleanupOldFiles() {
    const maxAge = 24 * 60 * 60 * 1000; // 24小时
    const now = Date.now();

    try {
        const files = fs.readdirSync(uploadDir);
        
        files.forEach(file => {
            const filePath = path.join(uploadDir, file);
            const stats = fs.statSync(filePath);
            
            if (now - stats.mtime.getTime() > maxAge) {
                fs.unlinkSync(filePath);
                logger.info(`Cleaned up old file: ${file}`);
            }
        });
    } catch (error) {
        logger.error(`Cleanup error: ${error.message}`);
    }
}

// 重试函数，处理网络波动
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            logger.info(`尝试执行操作 (第${attempt}次/${maxRetries}次)`);
            return await fn();
        } catch (error) {
            lastError = error;
            
            // 检查是否是可重试的错误
            const isRetryable = isRetryableError(error);
            
            if (!isRetryable || attempt === maxRetries) {
                logger.error(`操作失败 (第${attempt}次/${maxRetries}次)`, {
                    error: error.message,
                    retryable: isRetryable,
                    attempt: attempt
                });
                throw error;
            }
            
            const delay = baseDelay * Math.pow(2, attempt - 1); // 指数退避
            logger.warn(`操作失败，${delay}ms后重试 (第${attempt}次/${maxRetries}次)`, {
                error: error.message,
                nextRetryIn: delay
            });
            
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw lastError;
}

// 判断错误是否可重试
function isRetryableError(error) {
    const retryableMessages = [
        'socket hang up',
        'ECONNRESET',
        'ETIMEDOUT',
        'ENOTFOUND',
        'ECONNREFUSED',
        'getaddrinfo ENOTFOUND',
        'timeout',
        'network error',
        'connection error'
    ];
    
    const errorMessage = error.message.toLowerCase();
    const isNetworkError = retryableMessages.some(msg => errorMessage.includes(msg));
    
    // HTTP状态码重试策略
    const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
    const isRetryableStatus = error.response && retryableStatusCodes.includes(error.response.status);
    
    return isNetworkError || isRetryableStatus;
}

// 网络诊断函数
async function diagnoseNetworkIssue(error) {
    const diagnostics = {
        errorType: error.constructor.name,
        errorMessage: error.message,
        errorCode: error.code,
        timestamp: new Date().toISOString(),
        environment: {
            nodeVersion: process.version,
            platform: process.platform,
            hasProxy: !!process.env.HTTPS_PROXY,
            proxyUrl: process.env.HTTPS_PROXY,
            apiBase: process.env.OPENAI_API_BASE
        }
    };
    
    // 检查常见网络问题
    if (error.message.includes('socket hang up')) {
        diagnostics.possibleCauses = [
            '服务器提前关闭连接',
            '代理服务器配置问题',
            '请求超时',
            '网络不稳定'
        ];
        diagnostics.suggestions = [
            '检查HTTPS_PROXY配置是否正确',
            '确认API服务器是否正常运行',
            '尝试增加超时时间',
            '检查网络连接稳定性'
        ];
    }
    
    logger.error('网络诊断信息', diagnostics);
    return diagnostics;
}

// 错误处理中间件
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: '文件大小超过限制',
                code: 'FILE_TOO_LARGE',
                maxSize: '50MB'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                error: '一次只能上传一个文件',
                code: 'TOO_MANY_FILES'
            });
        }
    }
    
    if (error.message === '只支持PDF文件') {
        return res.status(400).json({
            error: '只支持PDF文件格式',
            code: 'INVALID_FILE_TYPE'
        });
    }

    logger.error('Unhandled error', { error: error.message, stack: error.stack });
    res.status(500).json({ 
        error: '内部服务器错误',
        code: 'INTERNAL_ERROR'
    });
});

// 404处理
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: '接口不存在',
        code: 'NOT_FOUND'
    });
});

// 优雅关闭
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});

app.listen(port, '0.0.0.0', () => {
    logger.info(`Backend server listening at http://0.0.0.0:${port}`);
    logger.info(`Local access: http://localhost:${port}`);
    logger.info(`Network access: http://127.0.0.1:${port}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`Upload directory: ${uploadDir}`);
    logger.info(`Output directory: ${outputDir}`);
    
    // 显示网络访问信息
    const os = require('os');
    const interfaces = os.networkInterfaces();
    logger.info('可用的网络接口:');
    Object.keys(interfaces).forEach(name => {
        interfaces[name].forEach(interface => {
            if (interface.family === 'IPv4' && !interface.internal) {
                logger.info(`  ${name}: http://${interface.address}:${port}`);
            }
        });
    });
});