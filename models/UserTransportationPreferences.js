var mongoose = require('mongoose');

var UserTransportationPreferences = new mongoose.Schema({
    id: String,
    userId: String,
    bicycling: Boolean,
    bus: Boolean,
    walking: Boolean,
    subway: Boolean,
    driving: Boolean
});

module.exports = mongoose.model('UserTransportationPreferences', UserTransportationPreferences);
