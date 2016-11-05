var express = require('express');
var router = express.Router();
var https = require('https');
var redis = require('../services/redis');

var mongoose = require('mongoose');
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

// Computes best way
router.post('/', (req, res) => {

  var departureLocation = req.body.departure;
  var arrivalLocation = req.body.arrival;

  var transportsArray = [];
  var count = 0;

  var promise = new Promise((resolve, reject) => { resolve(null) });
  transportationTypesArray.forEach(function (transportId, index) {
    promise = promise.then((res) => {
      if (res != null) {
        transportsArray.push(res);
      }
      return getTransportationInformations(transportId.type, transportId.subtype, departureLocation, arrivalLocation);
    }, (err) => {
      Promise.reject(err);
    });
  });

  promise.then(() => {
    rate(transportsArray).then(() => {
      UserTransportationPreferences.findOne({ 'userId': req.headers['x-user-id'] }, (err, userPrefs) => {
        rateToPracticalIndex(transportsArray, userPrefs).then(() => {
          res.status(200).json({
            response: { transportsArray }
          });
        });

      });
    });

  }, (error) => {
    console.log("Error in promise chain : ", error);
    res.status(204).json(err);
  });
});

function rateToPracticalIndex(transportsArray, userPreferences) {
  return new Promise((resolve, reject) => {

    // Sorting on rating
    transportsArray.sort((t1, t2) => {
      if (t1.grade > t2.grade) {
        return -1;
      } else if(t1.grade == t2.grade) {
        if (userPreferences != null) {
          if (userPreferences[t1.transport] && !userPreferences[t2.transport]) {
            return -1;
          } else if (!userPreferences[t1.transport] && userPreferences[t2.transport]) {
            return 1;
          } else {
            return 0;
          }
        } 
      } else {
        return 1;
      }
    });

    transportsArray.forEach((transport, index) => {
      transport.practicalIndex = index;
    });

    resolve();
  });
}

function getTransportationInformations(transportType, transportSubtype, departureLocation, arrivalLocation) {
  var BASE_GOOGLE_MAP_URL = "https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyD3MxmmqvuEMX5090XYlxTnveg-ZDlNXP0";
  var requestURL = BASE_GOOGLE_MAP_URL;
  requestURL += "&origin=" + departureLocation.latitude + "," + departureLocation.longitude;
  requestURL += "&destination=" + arrivalLocation.latitude + "," + arrivalLocation.longitude;
  var transport;
  if (transportType == "walking" || transportType == "bicycling" || transportType == "driving") {
    transport = transportType;
    requestURL += "&mode=" + transportType;
  } else {
    transport = transportSubtype;
    requestURL += "&mode=transit&transit_mode=" + transportSubtype;
  }

  return new Promise((resolve, reject) => {
    https.get(requestURL, (res) => {
      var json = '';
      res.on('data', (data) => {
        json += data;
      }).on('end', function () {
        var object = JSON.parse(json);
        if (object.status == 'ZERO_RESULTS') {
          reject(json);
          return;
        }

        var transitDetails = [];
        object.routes[0].legs[0].steps.forEach((step) => {
          if (step.transit_details) {
            var line = {
              number: step.transit_details.line.short_name,
              vehicle: step.transit_details.line.vehicle.type
            }
            if (transitDetails.indexOf(line) == -1) {
              transitDetails.push(line);
            }
          }
        });

        var result = { transport: transport, duration: object.routes[0].legs[0].duration.value, lines: transitDetails, grade: 100 };
        resolve(result);
      }).on('error', (error) => {
        reject(error);
      })
    });
  });

}

function rate(transportsArray) {
  return new Promise((resolve, reject) => {
    rateDependingOnWeather(transportsArray).then(() => {
      rateDependingOnTraffic(transportsArray).then(() => {
        resolve();
      });
    });
  })
}

function getTransportLineStatus(transportLine) {
  return new Promise((resolve, reject) => {
    redis.getInstance().then((redisInstance) => {
      redisInstance.get("TRAFFIC_" + transportLine.vehicle + "_" + transportLine.number, function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(result));
      });
    });
  });
}

function rateDependingOnTraffic(transportsArray) {
  return new Promise((resolve, reject) => {
    var promise = new Promise((resolve, reject) => { resolve(null) });
    transportsArray.forEach((transport) => {
      transport.lines.forEach((transportLine) => {
        promise = promise.then(() => {
          return getTransportLineStatus(transportLine).then((status) => {
            if (status != null) {
              transportLine.slug = status.slug;
              transportLine.title = status.title;
              transportLine.message = status.message;
              if (status.slug != "normal" && status.slug != "normal_trav") {
                transport.grade -= 20;
              }
            }
          }, (error) => {
            console.log(error);
          });
        });
      })
    });
    promise.then(() => {
      console.log('done');
      resolve();
    }, (error) => {
      console.log("Error : ", error);
    });
  });
}

function rateDependingOnWeather(transportsArray) {
  return new Promise((resolve, reject) => {
    redis.getInstance().then((redisInstance) => {
      redisInstance.get("LAST_WEATHER_FORECAST", function (err, result) {
        var weatherForecast = JSON.parse(result);
        if (!isWeatherOkForWalkOrRide(result)) {
          transportsArray.forEach((transport) => {
            if (transport.transport == "walking" || transport.transport == "bicycling") {
              transport.grade -= 10;
            }
          });
        }
        resolve();
      });
    });
  });
}

function isWeatherOkForWalkOrRide(weatherForecast) {
  if (weatherForecast.rain < 15 && weatherForecast.temperature.current > 0) { //arbitrary :/
    return true;
  }
  return false;
}

module.exports = router;
