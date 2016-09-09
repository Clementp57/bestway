var mongoose = require('mongoose');

var User = new mongoose.Schema({
        id: String,
        name: String,
        age: Number,
        sexe: String,
        password: String
    });

module.exports = mongoose.model('User', User);
