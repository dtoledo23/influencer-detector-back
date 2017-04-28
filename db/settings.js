module.exports = {
    host: process.env.DB_HOST || 'influencer_detector',
    port: process.env.DB_PORT || 9042,
    db: process.env.DB_NAME || 'test',
    user: process.env.DB_USER || '',
    pass: process.env.DB_PASSWORD || ''
};