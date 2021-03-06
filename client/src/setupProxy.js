const { createProxyMiddleware } = require('http-proxy-middleware');
const port = process.env.PORT || 3002;

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://localhost:${port}`,
      changeOrigin: true,
    })
  );
};
