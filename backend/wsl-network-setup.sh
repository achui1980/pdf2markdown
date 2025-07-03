#!/bin/bash

echo "=== WSL网络配置检查和设置 ==="
echo ""

# 1. 检查当前WSL IP
echo "1. 检查WSL IP地址:"
WSL_IP=$(hostname -I | awk '{print $1}')
echo "   WSL IP: $WSL_IP"
echo ""

# 2. 检查Windows主机IP
echo "2. 检查Windows主机信息:"
WINDOWS_IP=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}')
echo "   Windows IP: $WINDOWS_IP"
echo ""

# 3. 显示网络接口信息
echo "3. 网络接口信息:"
ip addr show | grep -E "inet.*scope global" | awk '{print "   " $2 " (" $NF ")"}'
echo ""

# 4. 测试端口绑定
echo "4. 检查端口3001是否可用:"
if netstat -tuln | grep -q ":3001 "; then
    echo "   ⚠️  端口3001已被占用"
    netstat -tuln | grep ":3001"
else
    echo "   ✅ 端口3001可用"
fi
echo ""

# 5. 提供访问信息
echo "5. 🌐 后端API访问地址:"
echo "   本地访问:     http://localhost:3001"
echo "   回环访问:     http://127.0.0.1:3001"
echo "   WSL内访问:    http://$WSL_IP:3001"
echo "   Windows访问:  http://$WSL_IP:3001"
echo ""

# 6. 前端配置建议
echo "6. 📝 前端配置建议:"
echo "   在前端项目中，将API_BASE_URL设置为:"
echo "   - 开发环境: http://$WSL_IP:3001"
echo "   - 或使用:   http://127.0.0.1:3001"
echo ""

# 7. 防火墙检查提示
echo "7. 🛡️  防火墙设置提示:"
echo "   如果无法访问，请检查:"
echo "   - Windows防火墙是否允许端口3001"
echo "   - WSL防火墙设置: sudo ufw status"
echo "   - 网络策略限制"
echo ""

# 8. 启动命令
echo "8. 🚀 启动后端服务:"
echo "   npm run dev"
echo "   或"
echo "   node index.js"
echo ""

echo "=== 配置完成 ==="
