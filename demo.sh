#!/bin/bash

# 节能改造计算平台演示脚本

echo "🚀 节能改造计算平台演示"
echo "=========================="
echo ""

# 检查服务器状态
echo "📡 检查服务器状态..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ 服务器运行正常"
else
    echo "❌ 服务器未运行，请先启动: npm run dev"
    exit 1
fi

echo ""
echo "🌐 访问地址:"
echo "本地访问: http://localhost:3000"
echo "局域网访问: http://192.168.0.100:3000"
echo ""

echo "🎯 主要功能页面:"
echo "1. 首页: http://localhost:3000"
echo "2. 计算器总览: http://localhost:3000/calculator"  
echo "3. HVAC计算器: http://localhost:3000/calculator/hvac"
echo "4. 冷水机组计算器: http://localhost:3000/calculator/hvac/source/chiller"
echo "5. 热泵系统计算器: http://localhost:3000/calculator/hvac/source/heat-pump"
echo "6. 工业高温热泵计算器: http://localhost:3000/calculator/hvac/source/industrial-heat-pump"
echo ""

echo "✨ 演示重点:"
echo "• 智能参数联动（城市→价格，场景→参数）"
echo "• 专业计算逻辑（分段效率、温度修正、财务分析）"
echo "• 透明计算过程（完整公式说明和技术标准）"
echo "• 现代界面设计（响应式布局、颜色编码）"
echo ""

echo "🎉 准备就绪，可以开始用户验证！"

# 自动打开浏览器（可选）
read -p "是否自动打开浏览器？(y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌐 正在打开浏览器..."
    open http://localhost:3000
fi






