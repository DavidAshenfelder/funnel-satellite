const { createProxyMiddleware } = require('http-proxy-middleware');
const port = 3002;

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://localhost:${port}`,
      changeOrigin: true,
    })
  );
};
