var http = require('http');
var WeatherForecast = require('../models/WeatherForecast');

var APP_ID = '4e9d4ebc5251fc01330592520cba5db5'; // put in constants file


var job = function() {
  var requestOptions = {
    host: 'api.openweathermap.org',
    port: 80,
    path: '/data/2.5/weather?q=Paris&APPID=' + APP_ID
  };

  http.get(requestOptions, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
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
          rain: response.rain?response.rain["3h"]:0,
          windspeed: response.wind.speed,
          clouds: response.clouds.all,
          sunrise: response.sys.sunrise * 1000, // UNIX Timestamp
          sunset: response.sys.sunset * 1000
        });

        weatherForecast.save(function(error, createdObject) {
          if(error) {
            console.log("Error saving weather forecast : ", error);
          } else { 
            console.log("Done saving weather forecast : ", createdObject);
          }
        });
    });
  });
}

module.exports = {
    executeJob : job
};
