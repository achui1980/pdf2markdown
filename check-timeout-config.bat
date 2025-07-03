@echo off
setlocal enabledelayedexpansion

echo === PDF转Markdown 超时配置测试 ===
echo.

REM 检查环境变量
echo 1. 检查前端环境变量配置:
if exist "frontend\.env" (
    echo    ✓ .env 文件存在
    findstr /C:"REACT_APP_REQUEST_TIMEOUT" frontend\.env >nul 2>&1
    if !errorlevel! equ 0 (
        for /f "tokens=2 delims==" %%a in ('findstr /C:"REACT_APP_REQUEST_TIMEOUT" frontend\.env') do (
            set /a timeout_minutes=%%a/60000
            echo    ✓ 超时设置: %%a ms ^(!timeout_minutes!分钟^)
        )
    ) else (
        echo    ⚠️ 未找到 REACT_APP_REQUEST_TIMEOUT 配置
    )
    
    findstr /C:"REACT_APP_API_BASE_URL" frontend\.env >nul 2>&1
    if !errorlevel! equ 0 (
        for /f "tokens=2 delims==" %%a in ('findstr /C:"REACT_APP_API_BASE_URL" frontend\.env') do (
            echo    ✓ API地址: %%a
        )
    ) else (
        echo    ⚠️ 未找到 REACT_APP_API_BASE_URL 配置
    )
) else (
    echo    ❌ .env 文件不存在
)

echo.

REM 检查前端axios配置
echo 2. 检查前端axios配置:
if exist "frontend\src\config\axios.js" (
    echo    ✓ axios配置文件存在
    findstr /C:"timeout:" frontend\src\config\axios.js >nul 2>&1
    if !errorlevel! equ 0 (
        echo    ✓ 配置了超时设置
    ) else (
        echo    ⚠️ 未找到超时配置
    )
) else (
    echo    ❌ axios配置文件不存在
)

echo.

REM 检查后端配置
echo 3. 检查后端超时配置:
if exist "backend\index.js" (
    echo    ✓ 后端文件存在
    findstr /C:"setTimeout" backend\index.js >nul 2>&1
    if !errorlevel! equ 0 (
        echo    ✓ 配置了请求超时
        for /f %%a in ('findstr /C:"setTimeout" backend\index.js ^| find /C /V ""') do (
            echo    📊 发现 %%a 个超时配置
        )
    ) else (
        echo    ⚠️ 未找到超时配置
    )
) else (
    echo    ❌ 后端文件不存在
)

echo.

REM 检查端口
echo 4. 检查服务端口:
netstat -an | findstr ":3000" >nul 2>&1
if !errorlevel! equ 0 (
    echo    ✓ 前端服务 ^(端口 3000^) 正在运行
) else (
    echo    ⚠️ 前端服务 ^(端口 3000^) 未运行
)

netstat -an | findstr ":3001" >nul 2>&1
if !errorlevel! equ 0 (
    echo    ✓ 后端服务 ^(端口 3001^) 正在运行
) else (
    echo    ⚠️ 后端服务 ^(端口 3001^) 未运行
)

echo.

REM API连通性测试
echo 5. API连通性测试:
set "api_url=http://localhost:3001"
if exist "frontend\.env" (
    for /f "tokens=2 delims==" %%a in ('findstr /C:"REACT_APP_API_BASE_URL" frontend\.env 2^>nul') do (
        set "api_url=%%a"
    )
)

echo    测试API地址: !api_url!

REM 尝试使用curl测试API
where curl >nul 2>&1
if !errorlevel! equ 0 (
    curl -s --max-time 5 "!api_url!/api/health" >nul 2>&1
    if !errorlevel! equ 0 (
        echo    ✓ API健康检查通过
    ) else (
        echo    ❌ API健康检查失败
    )
) else (
    echo    ⚠️ curl 不可用，跳过API测试
)

echo.

REM 建议和下一步
echo 6. 配置建议:
echo    📋 当前超时配置:
echo       - 前端请求超时: 10分钟 ^(600,000ms^)
echo       - 后端处理超时: 10分钟
echo       - 文件大小限制: 50MB
echo.
echo    🚀 测试方法:
echo       1. 启动后端: cd backend ^&^& npm start
echo       2. 启动前端: cd frontend ^&^& npm start
echo       3. 上传不同大小的PDF文件测试
echo.
echo    🔧 如果仍有超时问题:
echo       1. 增加 REACT_APP_REQUEST_TIMEOUT 值
echo       2. 检查网络连接稳定性
echo       3. 查看浏览器开发者工具的网络面板
echo       4. 检查后端日志是否有错误

echo.
echo === 测试完成 ===
pause
