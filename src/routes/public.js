var express = require('express');
var router = express.Router();
var auth = require('./auth.js');

// Login / register
router.post('/public/login', auth.login);
router.post('/public/register', auth.register);
router.post('/public/token/check', (req, res) => {
	require('../middlewares/validateToken');
	res.status(200);
	res.end();
});

module.exports = router;
