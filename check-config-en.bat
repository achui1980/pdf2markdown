@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo === PDF to Markdown Timeout Config Test ===
echo.

REM Check frontend environment variables
echo 1. Check frontend environment config:
if exist "frontend\.env" (
    echo    [OK] .env file exists
    findstr /C:"REACT_APP_REQUEST_TIMEOUT" frontend\.env >nul 2>&1
    if !errorlevel! equ 0 (
        for /f "tokens=2 delims==" %%a in ('findstr /C:"REACT_APP_REQUEST_TIMEOUT" frontend\.env') do (
            set /a timeout_minutes=%%a/60000
            echo    [OK] Timeout setting: %%a ms ^(!timeout_minutes! minutes^)
        )
    ) else (
        echo    [WARN] REACT_APP_REQUEST_TIMEOUT not found
    )
    
    findstr /C:"REACT_APP_API_BASE_URL" frontend\.env >nul 2>&1
    if !errorlevel! equ 0 (
        for /f "tokens=2 delims==" %%a in ('findstr /C:"REACT_APP_API_BASE_URL" frontend\.env') do (
            echo    [OK] API URL: %%a
        )
    ) else (
        echo    [WARN] REACT_APP_API_BASE_URL not found
    )
) else (
    echo    [ERROR] .env file not found
)

echo.

REM Check backend environment variables
echo 2. Check backend environment config:
if exist "backend\.env" (
    echo    [OK] backend .env file exists
    findstr /C:"ALLOWED_ORIGINS" backend\.env >nul 2>&1
    if !errorlevel! equ 0 (
        for /f "tokens=2 delims==" %%a in ('findstr /C:"ALLOWED_ORIGINS" backend\.env') do (
            echo    [OK] CORS Origins: %%a
        )
    ) else (
        echo    [WARN] ALLOWED_ORIGINS not found
    )
    
    findstr /C:"CORS_STRICT_MODE" backend\.env >nul 2>&1
    if !errorlevel! equ 0 (
        for /f "tokens=2 delims==" %%a in ('findstr /C:"CORS_STRICT_MODE" backend\.env') do (
            echo    [OK] CORS Strict Mode: %%a
        )
    ) else (
        echo    [WARN] CORS_STRICT_MODE not found
    )
) else (
    echo    [ERROR] backend .env file not found
)

echo.

REM Check axios config
echo 3. Check frontend axios config:
if exist "frontend\src\config\axios.js" (
    echo    [OK] axios config file exists
    findstr /C:"timeout:" frontend\src\config\axios.js >nul 2>&1
    if !errorlevel! equ 0 (
        echo    [OK] timeout configured
    ) else (
        echo    [WARN] timeout not found
    )
) else (
    echo    [ERROR] axios config file not found
)

echo.

REM Check backend config
echo 4. Check backend timeout config:
if exist "backend\index.js" (
    echo    [OK] backend file exists
    findstr /C:"setTimeout" backend\index.js >nul 2>&1
    if !errorlevel! equ 0 (
        echo    [OK] request timeout configured
        for /f %%a in ('findstr /C:"setTimeout" backend\index.js ^| find /C /V ""') do (
            echo    [INFO] Found %%a timeout configs
        )
    ) else (
        echo    [WARN] timeout not found
    )
) else (
    echo    [ERROR] backend file not found
)

echo.

REM Check ports
echo 5. Check service ports:
netstat -an | findstr ":3000" >nul 2>&1
if !errorlevel! equ 0 (
    echo    [OK] Frontend service ^(port 3000^) is running
) else (
    echo    [WARN] Frontend service ^(port 3000^) not running
)

netstat -an | findstr ":3001" >nul 2>&1
if !errorlevel! equ 0 (
    echo    [OK] Backend service ^(port 3001^) is running
) else (
    echo    [WARN] Backend service ^(port 3001^) not running
)

echo.

REM Recommendations
echo 6. Configuration Summary:
echo    [INFO] Current timeout config:
echo       - Frontend request timeout: 10 minutes ^(600,000ms^)
echo       - Backend processing timeout: 10 minutes
echo       - File size limit: 50MB
echo       - CORS: Allow all origins ^(*)
echo.
echo    [INFO] To test:
echo       1. Start backend: cd backend ^&^& npm start
echo       2. Start frontend: cd frontend ^&^& npm start
echo       3. Upload different sized PDF files
echo.
echo    [INFO] If timeout issues persist:
echo       1. Increase REACT_APP_REQUEST_TIMEOUT value
echo       2. Check network connection stability
echo       3. Check browser dev tools network panel
echo       4. Check backend logs for errors

echo.
echo === Test Complete ===
pause
