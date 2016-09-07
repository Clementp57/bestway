var mongoose = require('mongoose');

var RATPTraffic = new mongoose.Schema({
        id: String,
        type: String,
        line: String,
        slug: String,
        message: String
    });

module.exports = mongoose.model('RATPTraffic', RATPTraffic);
