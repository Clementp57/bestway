var mongoose = require('mongoose');

var UserTransportationPreferences = new mongoose.Schema({
        id: String,
        userId: String,
        bike: Boolean,
        bus: Boolean,
        walk: Boolean,
        subway: Boolean,
        car: Boolean
    });

module.exports = mongoose.model('User', User);
