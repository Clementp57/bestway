var express = require('express');
var router = express.Router();
var auth = require('./auth.js');

// Login / register
router.post('/public/login', auth.login);
router.post('/public/register', auth.register);
router.post('/public/token/check', function(req, res) {
	require('../middlewares/validateToken');
	res.status(200);
	res.end();
});


// SWAGGER /!\ Needs his own container, we can't run 3 instances
// router.get('/docs', function (req, res) {
//     res.sendFile(__dirname + '/swagger/index.html');
// });

module.exports = router;
