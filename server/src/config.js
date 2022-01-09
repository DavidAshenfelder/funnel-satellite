module.exports = {
  database: process.env.MONGO_DB,
  environment: process.env.ENVIRONMENT || 'dev',
  port: 3002,
}
