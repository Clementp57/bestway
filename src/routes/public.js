var express = require('express');
var router = express.Router();
var auth = require('./auth.js');

// Login / register
router.post('/public/login', auth.login);
router.post('/public/register', auth.register);
router.post('/public/tokenCheck', auth.tokenCheck);

module.exports = router;
