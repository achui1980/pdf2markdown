@echo off
setlocal enabledelayedexpansion

echo === CORS配置测试 ===
echo.

REM 获取后端地址
set "BACKEND_URL=http://localhost:3001"
if exist "backend\.env" (
    for /f "tokens=2 delims==" %%a in ('findstr /C:"PORT" backend\.env 2^>nul') do (
        set "BACKEND_URL=http://localhost:%%a"
    )
)

echo 测试后端地址: !BACKEND_URL!
echo.

REM 测试1: 简单的GET请求
echo 1. 测试基本API访问:
where curl >nul 2>&1
if !errorlevel! equ 0 (
    for /f %%a in ('curl -s -w "%%{http_code}" -o nul "!BACKEND_URL!/api/health" 2^>nul') do (
        if "%%a"=="200" (
            echo    ✓ API健康检查通过 ^(状态码: %%a^)
        ) else (
            echo    ❌ API健康检查失败 ^(状态码: %%a^)
        )
    )
) else (
    echo    ⚠️ curl 不可用
)

echo.

REM 测试2: CORS预检请求
echo 2. 测试CORS预检请求:
where curl >nul 2>&1
if !errorlevel! equ 0 (
    echo    测试来源: http://example.com
    for /f %%a in ('curl -s -w "%%{http_code}" -H "Origin: http://example.com" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: Content-Type" -X OPTIONS "!BACKEND_URL!/api/upload" 2^>nul') do (
        if "%%a"=="200" (
            echo    ✓ CORS预检请求通过 ^(状态码: %%a^)
        ) else if "%%a"=="204" (
            echo    ✓ CORS预检请求通过 ^(状态码: %%a^)
        ) else (
            echo    ❌ CORS预检请求失败 ^(状态码: %%a^)
        )
    )
    
    echo.
    echo    测试来源: https://unknown-domain.com
    for /f %%a in ('curl -s -w "%%{http_code}" -H "Origin: https://unknown-domain.com" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: Content-Type" -X OPTIONS "!BACKEND_URL!/api/upload" 2^>nul') do (
        if "%%a"=="200" (
            echo    ✓ 未知域名CORS请求通过 ^(状态码: %%a^)
        ) else if "%%a"=="204" (
            echo    ✓ 未知域名CORS请求通过 ^(状态码: %%a^)
        ) else (
            echo    ❌ 未知域名CORS请求失败 ^(状态码: %%a^)
        )
    )
) else (
    echo    ⚠️ curl 不可用，跳过CORS测试
)

echo.

REM 测试3: 检查响应头
echo 3. 检查CORS响应头:
where curl >nul 2>&1
if !errorlevel! equ 0 (
    curl -s -I -H "Origin: http://test.example.com" "!BACKEND_URL!/api/health" 2>nul | findstr /i "access-control-allow-origin" >nul
    if !errorlevel! equ 0 (
        for /f "tokens=2 delims=:" %%a in ('curl -s -I -H "Origin: http://test.example.com" "!BACKEND_URL!/api/health" 2^>nul ^| findstr /i "access-control-allow-origin"') do (
            echo    ✓ 找到 Access-Control-Allow-Origin: %%a
        )
    ) else (
        echo    ⚠️ 未找到 Access-Control-Allow-Origin 头
    )
    
    curl -s -I -H "Origin: http://test.example.com" "!BACKEND_URL!/api/health" 2>nul | findstr /i "access-control-allow-credentials" >nul
    if !errorlevel! equ 0 (
        for /f "tokens=2 delims=:" %%a in ('curl -s -I -H "Origin: http://test.example.com" "!BACKEND_URL!/api/health" 2^>nul ^| findstr /i "access-control-allow-credentials"') do (
            echo    ✓ 找到 Access-Control-Allow-Credentials: %%a
        )
    ) else (
        echo    ⚠️ 未找到 Access-Control-Allow-Credentials 头
    )
) else (
    echo    ⚠️ curl 不可用，跳过头部检查
)

echo.

REM 环境变量检查
echo 4. 检查CORS环境配置:
if exist "backend\.env" (
    findstr /C:"ALLOWED_ORIGINS" backend\.env >nul 2>&1
    if !errorlevel! equ 0 (
        for /f "tokens=2 delims==" %%a in ('findstr /C:"ALLOWED_ORIGINS" backend\.env') do (
            echo    ✓ ALLOWED_ORIGINS: %%a
            if "%%a"=="*" (
                echo    📢 当前配置允许所有来源访问
            )
        )
    ) else (
        echo    ⚠️ 未找到 ALLOWED_ORIGINS 配置
    )
    
    findstr /C:"CORS_STRICT_MODE" backend\.env >nul 2>&1
    if !errorlevel! equ 0 (
        for /f "tokens=2 delims==" %%a in ('findstr /C:"CORS_STRICT_MODE" backend\.env') do (
            echo    ✓ CORS_STRICT_MODE: %%a
        )
    ) else (
        echo    ⚠️ 未找到 CORS_STRICT_MODE 配置
    )
) else (
    echo    ❌ .env 文件不存在
)

echo.
echo === 测试完成 ===
echo.
echo 💡 如果需要修改CORS配置:
echo    - 编辑 backend\.env 文件
echo    - 设置 ALLOWED_ORIGINS=* 信任所有来源
echo    - 设置 CORS_STRICT_MODE=false 关闭严格模式
echo    - 重启后端服务
echo.
pause
