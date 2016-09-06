var mongoose = require('mongoose');

var WeatherForecast = new mongoose.Schema({
        id: String,
        main: String,
        description: String,
        temperature: {
          current: Number,
          min: Number,
          max: Number
        },
        pression: Number,
        humidity: Number,
        windspeed: Number,
        clouds: Number,
        sunrise: Date,
        sunset: Date
    });

module.exports = mongoose.model('WeatherForecast', WeatherForecast);
