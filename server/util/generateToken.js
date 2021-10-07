const jwt = require('jsonwebtoken');
const jwtSecret = Buffer.from(process.env.HASH_KEY, process.env.HASH_BASE);

const createToken = (user) => { return jwt.sign({sub: user.id}, jwtSecret, {expiresIn: '1h'}) }

module.exports = { createToken };