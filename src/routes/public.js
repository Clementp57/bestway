var express = require('express');
var router = express.Router();
var auth = require('./auth.js');

// Login / register
router.post('/public/login', auth.login);
router.post('/public/register', auth.register);
router.post('/public/tokenCheck', (req, res) => {
	require('../middlewares/validateToken')();
	console.log("TOKEN OK");
	res.status(200).json({
		"msg" : "token ok"
	});
	res.end();
});

module.exports = router;
