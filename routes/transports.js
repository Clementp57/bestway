var express = require('express');
var router = express.Router();
var RATPTraffic = require('../models/RATPTraffic');
var https = require('https');
var redis = require('../services/redis');

var mongoose = require('mongoose');
var WeatherForecast = require('../models/WeatherForecast');
var UserTransportationPreferences = require('../models/UserTransportationPreferences');

var transportationTypesArray = [
  { id: 0, type: "walking" },// marche
  { id: 1, type: "bicycling" },//vélo
  { id: 2, type: "driving" },//voiture
  { id: 3, type: "bus", subtype: "bus" },//bus
  { id: 4, type: "transit", subtype: "subway" },//métro
  { id: 5, type: "transit", subtype: "train" },
  { id: 6, type: "transit", subtype: "tram" },//tram
  { id: 7, type: "transit", subtype: "rail" }
]

function getTransportationInformations(transportType, transportSubtype, departureLocation, arrivalLocation) {
  var BASE_GOOGLE_MAP_URL = "https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyD3MxmmqvuEMX5090XYlxTnveg-ZDlNXP0";
  var requestURL = BASE_GOOGLE_MAP_URL;
  requestURL += "&origin=" + departureLocation.latitude + "," + departureLocation.longitude;
  requestURL += "&destination=" + arrivalLocation.latitude + "," + arrivalLocation.longitude;

  var transport;
  if (transportType == "walking" || transportType == "bicycling" || transportType == "driving") {
    transport = transportType;
  } else {
    transport = transportSubtype;
  }
  requestURL += "&mode=" + transport;

  return new Promise(function (resolve, reject) {
    https.get(requestURL, (res) => {
      var json = '';
      res.on('data', (data) => {
        json += data;
      }).on('end', function () {
        var object = JSON.parse(json);
        var result = { transport: transport, duration: object.routes[0].legs[0].duration.value };
        resolve(result);

      }).on('error', (error) => {
        reject(error);
      })
    });
  });

}

router.post('/', function (req, res) {

  var departureLocation = req.body.departure;
  var arrivalLocation = req.body.arrival;

  var responseArray = [];
  var count = 0;
  // ALGO ---------------
  // 1. Get duration for each transport
  // 2. Get last wheather forecast
  // 3. If rain, walking/bicycling last
  // 4. Sort transports on userPreferences
  // --------------------

  var promise = new Promise((resolve, reject) => { resolve(null) });
  transportationTypesArray.forEach(function (transportId, index) {
    promise = promise.then(function (res) {
      if (res != null) {
        responseArray.push(res);
      }
      return getTransportationInformations(transportId.type, transportId.subtype, departureLocation, arrivalLocation);
    });
  });

  promise.then(function () {
    
    redis.getInstance().then((redisInstance) => {
      redisInstance.get("LAST_WEATHER_FORECAST", function(err, result) {
        var weatherForecast = JSON.parse(result);

        if(!isWeatherOkForWalkOrRide(wheaterForecast)) {
          // TODO: put walk and ride last

        }

        // TODO: look for incident on subway, tram... etc


      });
    });
    

      // UserTransportationPreferences.findOne({ 'userId': req.headers['x-user-id'] }, 'bike  bus walk subway car', function (err, preference) {
      //   if (err || !preference) {
      //     // No preferences

      //   } else {
          
      //   }
      // });
    // TMP
    for (var k = 0; k < responseArray.length; k++) {
      if (responseArray[k].transport == "walking") {
        responseArray[k].praticalIndex = 0;
      } else if (responseArray[k].transport == "bicycling") {
        responseArray[k].praticalIndex = 1;
      } else if (responseArray[k].transport == "driving") {
        responseArray[k].praticalIndex = 4;
      } else if (responseArray[k].transport == "bus") {
        responseArray[k].praticalIndex = 3;
      } else if (responseArray[k].transport == "subway") {
        responseArray[k].praticalIndex = 2;
      }
    }

    res.status(200).json({
      response: { responseArray }
    });
  });
});

function isWeatherOkForWalkOrRide(weatherForecast) {
  if(rain < 15 && temperature.current > 0) { //arbitrary :/
    return true;
  } 
  return false;
}

router.get('/all', function (req, res) {
  RATPTraffic.find({}, function (err, traffic) {
    res.status(200).json(traffic);
  });
});
router.get('/weather', function (req, res) {
  WeatherForecast.find({}, function (err, weather) {
    res.status(200).json(weather);
  });
});

module.exports = router;
