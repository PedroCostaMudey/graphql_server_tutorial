const express = require('express');
const {auth} = require('../../middleware/auth');

const { login } = require('../../controllers/login/login');

const router = express.Router();

// ROUTES
router.post('/login', login);
//router.post('/register', register);
//router.post('/register', info);
//router.post('/register', auth, edit);

module.exports = router;