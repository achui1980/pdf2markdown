@echo off
echo 正在修复依赖项版本兼容性问题...

REM 删除现有的 node_modules 和 package-lock.json
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo 正在重新安装兼容的依赖项...

REM 重新安装依赖项
npm install

echo 依赖项重新安装完成！
echo.
echo 修复说明：
echo 1. 将 Express 从 5.x 降级到稳定的 4.18.2
echo 2. 将 Multer 从 2.x 降级到稳定的 1.4.5-lts.1
echo 3. 修复了路径解析问题
echo.
echo 现在可以重新启动服务器: npm run dev

pause
