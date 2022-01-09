module.exports = {
  database: process.env.MONGO_DB,
  environment: process.env.ENVIRONMENT || 'dev',
  port: process.env.PORT || 3002
}
