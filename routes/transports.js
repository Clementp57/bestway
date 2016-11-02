var express = require('express');
var router = express.Router();
var RATPTraffic = require('../models/RATPTraffic');
var https = require('https');

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

function getTransportationInformations(transportType, transportSubtype, departureLocation, arrivalLocation)  {
  var BASE_GOOGLE_MAP_URL = "https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyD3MxmmqvuEMX5090XYlxTnveg-ZDlNXP0";
  var requestURL = BASE_GOOGLE_MAP_URL;
  requestURL += "&origin=" + departureLocation.latitude + "," + departureLocation.longitude;
  requestURL += "&destination=" + arrivalLocation.latitude + "," + arrivalLocation.longitude;
  
  var transport;
  if(transportType == "walking" || transportType == "bicycling" || transportType == "driving") {
    transport = transportType;
  } else {
    transport = transportSubtype;
  }
  requestURL += "&mode=" + transport;

  console.log(requestURL);

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
    promise = promise.then(function(res) {
      console.log("res => ", res);
      if(res != null) {
        responseArray.push(res);
      }
      return getTransportationInformations(transportId.type, transportId.subtype, departureLocation, arrivalLocation);
    });    
  });

  promise.then(function() {
//         UserTransportationPreferences.findOne({ 'userId': req.headers['x-user-id'] }, 'bike  bus walk subway car', function (err, preference) {
  //           if (err || !preference) {
  //             // No preferences

  //           } else {

  //           }
  //         });

    res.status(200).json({
      response: { responseArray }
    });
  });
});

router.get('/', function (req, res) {
  var departureLocation = { latitude: 48.8488247, longitude: 2.3892222 };//{latitude : req.query.dep.split(",")[0], longitude : req.query.dep.split(",")[1]};
  var arrivalLocation = { latitude: 48.856614, longitude: 2.352222 };//{latitude : req.query.arr.split(",")[0], longitude : req.query.arr.split(",")[1]};
  var transportationsArray = [0, 1, 2, 3, 4];//req.query.transp.split(",");
  // transportations id -> cf transport variable (lower in code)



  // TODO : requêter temps de chaque trajet & traffic autour du trajet voiture/bus + créer algorithme de sorting des listes
  var responseArray = [];

  // travel modes :
  // transit
  // walking
  // driving
  // bicycling
  var transportationTypesArray = [
    { id: 0, type: "walking" },// marche
    { id: 1, type: "bicycling" },//vélo
    { id: 2, type: "driving" },//voiture
    { id: 3, type: "transit", subtype: "bus" },//bus
    { id: 4, type: "transit", subtype: "subway" },//métro
    { id: 5, type: "transit", subtype: "train" },
    { id: 6, type: "transit", subtype: "tram" },//tram
    { id: 7, type: "transit", subtype: "rail" }
  ]

  var count = 0;
  transportationsArray.forEach(function (transportId, index, transportationsArray) {

    (function (id, transports, i, myarray, myRes) {
      var https = require('https');

      var requestUrl = "https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyD3MxmmqvuEMX5090XYlxTnveg-ZDlNXP0&origin=" + departureLocation.latitude + "," + departureLocation.longitude + "&destination=" + arrivalLocation.latitude + "," + arrivalLocation.longitude + "&mode=" + transports[id]["type"];
      if (id > 2) {
        requestUrl += "&transit_mode=" + transports[id]["subtype"];
      }
      console.log(requestUrl);
      https.get(requestUrl, (res) => {
        var json = '';
        res.on('data', (data) => {
          json += data;
        }).on('end', function () {
          // console.log(json);
          var obj = JSON.parse(json);
          // console.log("distance : " + obj.routes[0].legs[0].distance.value);
          // console.log("duration : " + obj.routes[0].legs[0].duration.value);
          // var test = obj.routes[0].legs[0].steps.filter(function(item){
          //   return item.travel_mode === "TRANSIT";
          // });
          // console.log(JSON.stringify(test));

          if (i < 3) {
            var newObject = { transport: transports[i].type, duration: obj.routes[0].legs[0].distance.value };
          } else {
            var newObject = { transport: transports[i].subtype, duration: obj.routes[0].legs[0].distance.value };
          }
          responseArray.push(newObject);
          count++;
          if (count >= 5) {
            responseArray.sort(function (a, b) {
              if (a.duration > b.duration) {
                return 1;
              }
              if (a.duration < b.duration) {
                return -1;
              }
              return 0;
            });

            for (var j = 0; j < responseArray.length; j++) {
              responseArray[j].durationIndex = j;
            }
            // console.log(responseArray);

            // TODO : test on forecast
            // WeatherForecast.findOne().sort({created_at: 1}).exec(function(err, post) {
            //   if(post.rain > 0){
            //     responseArray.findOne({'transport' : 'cycling'}, function(error, response){
            //       console.log(response);
            //     });
            //       responseArray.findOne({'transport' : 'walking'}, function(error, response){
            //         console.log(response);
            //       });
            //   }
            // });

            // TMP :
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
            console.log(responseArray);
            myRes.status(200).json({
              response: { responseArray }
            });
          }
        });
      }).on('error', (e) => {
        console.log("errorwhile requesting Google maps directions API : " + e.message);
      });
    })(transportId, transportationTypesArray, index, responseArray, res);

  });

  // res.status(200).json({
  //   access: 'ok'
  // });

});

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
