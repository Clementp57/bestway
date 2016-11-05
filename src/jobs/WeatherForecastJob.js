var http = require('http');
var WeatherForecast = require('../models/WeatherForecast');
var redis = require('../services/redis');
var mailer = require('../services/mailer');

var APP_ID = '4e9d4ebc5251fc01330592520cba5db5'; // put in constants file


var job = () => {
    var requestOptions = {
        host: 'api.openweathermap.org',
        port: 80,
        path: '/data/2.5/weather?q=Paris&APPID=' + APP_ID
    };

    http.get(requestOptions, (res) => {
        var body = '';

        res.on('data', (chunk) => {
            body += chunk;
        });

        res.on('end', () => {
            try {
                var response = JSON.parse(body);

                var weatherForecast = new WeatherForecast({
                    main: response.weather[0].main,
                    description: response.weather[0].description,
                    temperature: {
                        current: response.main.temp - 273.15, // °K to °C
                        min: response.main.temp_min - 273.15,
                        max: response.main.temp_max - 273.15
                    },
                    pression: response.main.pressure,
                    humidity: response.main.humidity,
                    rain: response.rain ? response.rain["3h"] : 0,
                    windspeed: response.wind.speed,
                    clouds: response.clouds.all,
                    sunrise: response.sys.sunrise * 1000, // UNIX Timestamp
                    sunset: response.sys.sunset * 1000
                });

                console.log('trying to save');
                redis.getInstance().then((redisInstance) => {
                    redisInstance.set("LAST_WEATHER_FORECAST", JSON.stringify(weatherForecast))
                    console.log("Done saving weather forecast : ", weatherForecast);
                });

            } catch (error) {
                mailer.sendJobFailureMail('WeatherForecastJob', error);
                return;
            }
        });

        res.on('error', (error) => {
            mailer.sendJobFailureMail('WeatherForecastJob', error);
        });
    });
}

module.exports = {
    executeJob: job
};
