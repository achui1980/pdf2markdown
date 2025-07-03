#!/bin/bash

# CORS配置测试脚本

echo "=== CORS配置测试 ==="
echo ""

# 获取后端地址
BACKEND_URL="http://localhost:3001"
if [ -f "backend/.env" ] && grep -q "PORT" backend/.env; then
    PORT=$(grep "PORT" backend/.env | cut -d'=' -f2)
    BACKEND_URL="http://localhost:$PORT"
fi

echo "测试后端地址: $BACKEND_URL"
echo ""

# 测试1: 简单的GET请求
echo "1. 测试基本API访问:"
if command -v curl >/dev/null 2>&1; then
    response=$(curl -s -w "%{http_code}" -o /dev/null "$BACKEND_URL/api/health" 2>/dev/null)
    if [ "$response" = "200" ]; then
        echo "   ✓ API健康检查通过 (状态码: $response)"
    else
        echo "   ❌ API健康检查失败 (状态码: $response)"
    fi
else
    echo "   ⚠️ curl 不可用"
fi

echo ""

# 测试2: CORS预检请求
echo "2. 测试CORS预检请求:"
if command -v curl >/dev/null 2>&1; then
    echo "   测试来源: http://example.com"
    cors_response=$(curl -s -w "%{http_code}" \
        -H "Origin: http://example.com" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        "$BACKEND_URL/api/upload" 2>/dev/null)
    
    if [ "$cors_response" = "200" ] || [ "$cors_response" = "204" ]; then
        echo "   ✓ CORS预检请求通过 (状态码: $cors_response)"
    else
        echo "   ❌ CORS预检请求失败 (状态码: $cors_response)"
    fi
    
    echo ""
    echo "   测试来源: https://unknown-domain.com"
    cors_response2=$(curl -s -w "%{http_code}" \
        -H "Origin: https://unknown-domain.com" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        "$BACKEND_URL/api/upload" 2>/dev/null)
    
    if [ "$cors_response2" = "200" ] || [ "$cors_response2" = "204" ]; then
        echo "   ✓ 未知域名CORS请求通过 (状态码: $cors_response2)"
    else
        echo "   ❌ 未知域名CORS请求失败 (状态码: $cors_response2)"
    fi
else
    echo "   ⚠️ curl 不可用，跳过CORS测试"
fi

echo ""

# 测试3: 检查响应头
echo "3. 检查CORS响应头:"
if command -v curl >/dev/null 2>&1; then
    headers=$(curl -s -I \
        -H "Origin: http://test.example.com" \
        "$BACKEND_URL/api/health" 2>/dev/null)
    
    if echo "$headers" | grep -i "access-control-allow-origin" >/dev/null; then
        allow_origin=$(echo "$headers" | grep -i "access-control-allow-origin" | cut -d':' -f2 | tr -d ' \r')
        echo "   ✓ 找到 Access-Control-Allow-Origin: $allow_origin"
    else
        echo "   ⚠️ 未找到 Access-Control-Allow-Origin 头"
    fi
    
    if echo "$headers" | grep -i "access-control-allow-credentials" >/dev/null; then
        allow_creds=$(echo "$headers" | grep -i "access-control-allow-credentials" | cut -d':' -f2 | tr -d ' \r')
        echo "   ✓ 找到 Access-Control-Allow-Credentials: $allow_creds"
    else
        echo "   ⚠️ 未找到 Access-Control-Allow-Credentials 头"
    fi
else
    echo "   ⚠️ curl 不可用，跳过头部检查"
fi

echo ""

# 环境变量检查
echo "4. 检查CORS环境配置:"
if [ -f "backend/.env" ]; then
    if grep -q "ALLOWED_ORIGINS" backend/.env; then
        origins=$(grep "ALLOWED_ORIGINS" backend/.env | cut -d'=' -f2)
        echo "   ✓ ALLOWED_ORIGINS: $origins"
        
        if [ "$origins" = "*" ]; then
            echo "   📢 当前配置允许所有来源访问"
        fi
    else
        echo "   ⚠️ 未找到 ALLOWED_ORIGINS 配置"
    fi
    
    if grep -q "CORS_STRICT_MODE" backend/.env; then
        strict_mode=$(grep "CORS_STRICT_MODE" backend/.env | cut -d'=' -f2)
        echo "   ✓ CORS_STRICT_MODE: $strict_mode"
    else
        echo "   ⚠️ 未找到 CORS_STRICT_MODE 配置"
    fi
else
    echo "   ❌ .env 文件不存在"
fi

echo ""
echo "=== 测试完成 ==="
echo ""
echo "💡 如果需要修改CORS配置:"
echo "   - 编辑 backend/.env 文件"
echo "   - 设置 ALLOWED_ORIGINS=* 信任所有来源"
echo "   - 设置 CORS_STRICT_MODE=false 关闭严格模式"
echo "   - 重启后端服务"
