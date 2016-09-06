var http = require('http');
var WeatherForecast = require('../models/WeatherForecast');

var APP_ID = '4e9d4ebc5251fc01330592520cba5db5'; // put in constants file

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

      var WeatherForecast = new WeatherForecast({
        main: reponse.weather[0].main,
        description: reponse.weather[0].description,
        temperature: {
          current: response.main.temp - 273.15, // °K to °C
          min: response.main.temp_min - 273.15,
          max: response.main.temp_max - 273.15
        },
        pression: response.main.pressure,
        humidity: response.main.humidity,
        windspeed: response.wind.speed,
        clouds: response.clouds.all,
        sunrise: response.sys.sunrise,
        sunset: response.sys.sunset //TIMESTAMP conversion
      });
