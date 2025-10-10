const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

const PORT = process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  // 健康检查端点
  server.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: '节能改造计算平台'
    });
  });

  // 处理所有其他请求
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`🚀 节能改造计算平台启动成功`);
    console.log(`📱 本地访问: http://localhost:${PORT}`);
    console.log(`🌐 环境: ${dev ? '开发' : '生产'}`);
  });
}).catch((ex) => {
  console.error('启动失败:', ex.stack);
  process.exit(1);
});








