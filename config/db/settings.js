module.exports = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 27017,
  db: process.env.DB_NAME || 'test',
  user: process.env.DB_USER || '',
  pass: process.env.DB_PASSWORD || ''
}
