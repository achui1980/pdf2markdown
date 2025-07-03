#!/bin/bash

# 超时配置测试脚本
# 用于验证前后端超时设置是否正确配置

echo "=== PDF转Markdown 超时配置测试 ==="
echo ""

# 检查环境变量
echo "1. 检查前端环境变量配置:"
if [ -f "frontend/.env" ]; then
    echo "   ✓ .env 文件存在"
    if grep -q "REACT_APP_REQUEST_TIMEOUT" frontend/.env; then
        timeout_value=$(grep "REACT_APP_REQUEST_TIMEOUT" frontend/.env | cut -d'=' -f2)
        echo "   ✓ 超时设置: ${timeout_value}ms ($(($timeout_value / 60000))分钟)"
    else
        echo "   ⚠️  未找到 REACT_APP_REQUEST_TIMEOUT 配置"
    fi
    
    if grep -q "REACT_APP_API_BASE_URL" frontend/.env; then
        api_url=$(grep "REACT_APP_API_BASE_URL" frontend/.env | cut -d'=' -f2)
        echo "   ✓ API地址: ${api_url}"
    else
        echo "   ⚠️  未找到 REACT_APP_API_BASE_URL 配置"
    fi
else
    echo "   ❌ .env 文件不存在"
fi

echo ""

# 检查前端axios配置
echo "2. 检查前端axios配置:"
if [ -f "frontend/src/config/axios.js" ]; then
    echo "   ✓ axios配置文件存在"
    if grep -q "timeout:" frontend/src/config/axios.js; then
        echo "   ✓ 配置了超时设置"
    else
        echo "   ⚠️  未找到超时配置"
    fi
else
    echo "   ❌ axios配置文件不存在"
fi

echo ""

# 检查后端配置
echo "3. 检查后端超时配置:"
if [ -f "backend/index.js" ]; then
    echo "   ✓ 后端文件存在"
    if grep -q "setTimeout" backend/index.js; then
        echo "   ✓ 配置了请求超时"
        timeout_count=$(grep -c "setTimeout" backend/index.js)
        echo "   📊 发现 ${timeout_count} 个超时配置"
    else
        echo "   ⚠️  未找到超时配置"
    fi
else
    echo "   ❌ 后端文件不存在"
fi

echo ""

# 检查端口是否可用
echo "4. 检查服务端口:"
check_port() {
    local port=$1
    local service=$2
    
    if command -v nc >/dev/null 2>&1; then
        if nc -z localhost $port 2>/dev/null; then
            echo "   ✓ $service (端口 $port) 正在运行"
            return 0
        else
            echo "   ⚠️  $service (端口 $port) 未运行"
            return 1
        fi
    elif command -v telnet >/dev/null 2>&1; then
        if timeout 1 telnet localhost $port >/dev/null 2>&1; then
            echo "   ✓ $service (端口 $port) 正在运行"
            return 0
        else
            echo "   ⚠️  $service (端口 $port) 未运行"
            return 1
        fi
    else
        echo "   ⚠️  无法检查端口状态 (nc/telnet 不可用)"
        return 1
    fi
}

# 检查常用端口
check_port 3000 "前端服务"
check_port 3001 "后端服务"

echo ""

# API连通性测试
echo "5. API连通性测试:"
if command -v curl >/dev/null 2>&1; then
    api_url="http://localhost:3001"
    if [ -f "frontend/.env" ] && grep -q "REACT_APP_API_BASE_URL" frontend/.env; then
        api_url=$(grep "REACT_APP_API_BASE_URL" frontend/.env | cut -d'=' -f2)
    fi
    
    echo "   测试API地址: $api_url"
    
    # 测试健康检查端点
    if curl -s --max-time 5 "$api_url/api/health" >/dev/null 2>&1; then
        echo "   ✓ API健康检查通过"
    else
        echo "   ❌ API健康检查失败"
    fi
    
    # 测试根路径
    if curl -s --max-time 5 "$api_url/" >/dev/null 2>&1; then
        echo "   ✓ 根路径访问正常"
    else
        echo "   ❌ 根路径访问失败"
    fi
else
    echo "   ⚠️  curl 不可用，跳过API测试"
fi

echo ""

# 建议和下一步
echo "6. 配置建议:"
echo "   📋 当前超时配置:"
echo "      - 前端请求超时: 10分钟 (600,000ms)"
echo "      - 后端处理超时: 10分钟"
echo "      - 文件大小限制: 50MB"
echo ""
echo "   🚀 测试方法:"
echo "      1. 启动后端: cd backend && npm start"
echo "      2. 启动前端: cd frontend && npm start"
echo "      3. 上传不同大小的PDF文件测试"
echo ""
echo "   🔧 如果仍有超时问题:"
echo "      1. 增加 REACT_APP_REQUEST_TIMEOUT 值"
echo "      2. 检查网络连接稳定性"
echo "      3. 查看浏览器开发者工具的网络面板"
echo "      4. 检查后端日志是否有错误"

echo ""
echo "=== 测试完成 ==="
