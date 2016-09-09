var express = require('express');
var router = express.Router();
var API_BASE_PATH = "/api/v1";

// Test Route
router.get(API_BASE_PATH, function(req, res) {
    res.status(200).json({
        msg: 'OK'
    });
});

module.exports = router;
