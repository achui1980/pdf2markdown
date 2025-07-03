const https = require('https');
const http = require('http');
const { URL } = require('url');

// 测试网络连接的函数
async function testNetworkConnection() {
    console.log('=== 网络连接诊断 ===');
    console.log('');

    // 读取环境变量
    require('dotenv').config();
    
    const apiBase = process.env.OPENAI_API_BASE;
    const proxy = process.env.HTTPS_PROXY;
    const apiKey = process.env.OPENAI_API_KEY;

    console.log('1. 环境配置检查:');
    console.log(`   API Base URL: ${apiBase}`);
    console.log(`   Proxy: ${proxy || '未配置'}`);
    console.log(`   API Key: ${apiKey ? `${apiKey.substring(0, 10)}...` : '未配置'}`);
    console.log('');

    // 测试基础网络连通性
    console.log('2. 基础网络连通性测试:');
    
    try {
        if (apiBase) {
            const url = new URL(apiBase);
            await testHttpConnection(url.hostname, url.port || (url.protocol === 'https:' ? 443 : 80), url.protocol === 'https:');
            console.log(`   ✓ ${url.hostname} 连接正常`);
        }
    } catch (error) {
        console.log(`   ❌ ${apiBase} 连接失败: ${error.message}`);
    }

    // 测试代理连接
    if (proxy) {
        console.log('');
        console.log('3. 代理连接测试:');
        try {
            const proxyUrl = new URL(proxy);
            await testHttpConnection(proxyUrl.hostname, proxyUrl.port, false);
            console.log(`   ✓ 代理 ${proxy} 连接正常`);
        } catch (error) {
            console.log(`   ❌ 代理 ${proxy} 连接失败: ${error.message}`);
        }
    }

    // 测试API端点
    console.log('');
    console.log('4. API端点测试:');
    if (apiBase && apiKey) {
        try {
            await testOpenAIAPI(apiBase, apiKey, proxy);
            console.log('   ✓ OpenAI API 连接正常');
        } catch (error) {
            console.log(`   ❌ OpenAI API 连接失败: ${error.message}`);
            console.log(`   详细错误: ${error.code || 'N/A'}`);
        }
    } else {
        console.log('   ⚠️ API Base URL 或 API Key 未配置，跳过测试');
    }

    console.log('');
    console.log('=== 诊断完成 ===');
}

// 测试HTTP连接
function testHttpConnection(hostname, port, useHttps = true) {
    return new Promise((resolve, reject) => {
        const client = useHttps ? https : http;
        const options = {
            hostname: hostname,
            port: port,
            method: 'GET',
            timeout: 10000,
            headers: {
                'User-Agent': 'PDF2Markdown-NetworkTest/1.0'
            }
        };

        const req = client.request(options, (res) => {
            resolve(res);
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('连接超时'));
        });

        req.end();
    });
}

// 测试OpenAI API
function testOpenAIAPI(baseURL, apiKey, proxy) {
    return new Promise((resolve, reject) => {
        const url = new URL('/v1/models', baseURL);
        
        const options = {
            hostname: url.hostname,
            port: url.port || (url.protocol === 'https:' ? 443 : 80),
            path: url.pathname,
            method: 'GET',
            timeout: 30000,
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'User-Agent': 'PDF2Markdown-NetworkTest/1.0'
            }
        };

        // 如果使用代理
        if (proxy) {
            const proxyUrl = new URL(proxy);
            options.hostname = proxyUrl.hostname;
            options.port = proxyUrl.port;
            options.path = `${url.protocol}//${url.hostname}:${url.port || (url.protocol === 'https:' ? 443 : 80)}${url.pathname}`;
            options.headers['Host'] = url.hostname;
        }

        const client = url.protocol === 'https:' ? https : http;
        const req = client.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(data);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('API请求超时'));
        });

        req.end();
    });
}

// 运行测试
if (require.main === module) {
    testNetworkConnection().catch(error => {
        console.error('测试脚本执行失败:', error.message);
        process.exit(1);
    });
}

module.exports = { testNetworkConnection };
