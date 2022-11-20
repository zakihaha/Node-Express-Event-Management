require('dotenv').config()

module.exports = {
    urlDb: process.env.URL_MONGODB_DEV,
    jwtExpiration: process.env.JWT_EXPIRATION,
    jwtSecret: process.env.JWT_SECRET,
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
}